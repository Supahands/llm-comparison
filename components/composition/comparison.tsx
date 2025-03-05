"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import IconButton from "@/components/ui/icon-button";
import { AxiosResponse } from "axios";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useAppStore from "@/hooks/store/useAppStore";
import { useIsMobile } from "@/hooks/use-mobile";
import { DATABASE_TABLE } from "@/lib/constants/databaseTables";
import { API_URL } from "@/lib/constants/urls";
import { supabaseClient } from "@/lib/supabase/supabaseClient";
import { MessageRequest } from "@/lib/types/message";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { Paperclip, RotateCcw, Send, Wand, X } from "lucide-react";
import { usePostHog } from "posthog-js/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { v4 as uuidv4 } from "uuid";
import { Textarea } from "../ui/textarea";
import DataConsentModal from "./data-consent-modal";
import ModelResponses from "./model-responses";
import PromptDisplay from "./prompt-display";
import PromptSelector from "./prompt-selector";
import WinnerSelector from "./winner-selector";

const prompts = [
  "What are the most popular car brands in Japan?",
  "Gather the top insights on the Southeast Asian vehicle market",
  "Give me the latest updates on the US Presidential elections",
  "Compare the education system in the UK vs the USA",
];

export default function Comparison() {
  const {
    prompt,
    selectedModel1,
    selectedModel2,
    isComparingModel,
    userChoices,
    responseModel1,
    responseModel2,
    responseTime1,
    responseTime2,
    selectedChoice,
    hasRoundEnded,
    incrementRoundCounter,
    responseOrder,
    reset,
    setPrompt,
    setResponseModel1,
    setResponseModel2,
    setResponseTime1,
    setResponseTime2,
    setIsComparingModel,
    sessionId,
    setSessionId,
    setPromptToken,
    setCompletionToken1,
    setCompletionToken2,
    promptToken,
    completionToken1,
    completionToken2,
    isRetryOverlay,
    setIsRetryOverlay,
    systemPrompt,
    temperature,
    topP,
    maxTokens,
    jsonFormat,
    images,
    setImages,
    isModel1Multimodal,
    isModel2Multimodal,
    explainChoice,
    idealResponse,
    setUseAIGeneratedPrompt,
    useAIGeneratedPrompt,
    isSingleModelMode,
    isPendingModel1,
    isPendingModel2
  } = useAppStore();

  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const posthog = usePostHog();

  const [newMessage, setNewMessage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [convertedImages, setConvertedImages] = useState<string[]>([]);
  const [isAIGenerationEnabled, setIsAIGenerationEnabled] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files ? Array.from(event.target.files) : [];
    const maxFiles = 3;
    const maxSize = 10 * 1024 * 1024;

    if (files.length + newImages.length > maxFiles) {
      alert(`You can upload up to ${maxFiles} files only.`);
      return;
    }

    const oversizedFiles = files.filter((file) => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      alert(`Each file must be smaller than 10MB.`);
      return;
    }

    const renamedFiles = files.map((file) => {
      const newFileName = `${uuidv4()}${file.name.substring(
        file.name.lastIndexOf(".")
      )}`;
      return new File([file], newFileName, { type: file.type });
    });

    const converted = await Promise.all(
      renamedFiles.map((file) => convertToBase64(file))
    );

    setNewImages((prevFiles) => [...prevFiles, ...renamedFiles]);
    setConvertedImages(converted);
  }

  function handleRemoveFile(index: number) {
    setNewImages((prevFiles) => prevFiles.filter((_, i) => i !== index));
  }

  async function handleUpload() {
    const formData = new FormData();

    images.forEach((file) => {
      formData.append("files", file);
    });
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("error on uploading images", data);
      }
    } catch (err) {
      console.error("error on uploading images", err);
    }
  }

  function handleButtonClick() {
    fileInputRef.current?.click();
  }

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      if (!file) {
        resolve("");
        return;
      }

      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => {
        resolve(reader.result as string);
      };

      reader.onerror = (error) => {
        resolve("");
        return;
      };
    });
  };

  const { mutate: mutateModel1 } = useMutation({
    mutationKey: ["model1"],
    mutationFn: (data: MessageRequest) => {
      return axios.post(`${API_URL}/message`, data);
    },
    onSuccess: async (response) => {
      const data = response.data;
      const choices = data.choices;
      const responseModel1Content =
        (choices[0]?.message?.content as string) || "";
      setResponseModel1(responseModel1Content);
      if (responseModel1Content === "") {
        setIsRetryOverlay(true);
      }
      setResponseTime1(data.usage.response_time);
      setPromptToken(data.usage.prompt_tokens);
      setCompletionToken1(data.usage.completion_tokens);
    },
    onError: (error) => {
      setIsRetryOverlay(true);
      console.log("error1", error);
    },
  });

  const { mutate: mutateModel2 } = useMutation({
    mutationKey: ["model2"],
    mutationFn: (data: MessageRequest) => {
      if (isSingleModelMode) {
        return new Promise<AxiosResponse<any, any>>(
          () => { return true })
      }
      return axios.post(`${API_URL}/message`, data);
    },
    onSuccess: async (response: AxiosResponse<any, any>) => {
      if (isSingleModelMode) {
        setResponseModel2("_")
        setResponseTime2(0)
        setPromptToken(0)
        setCompletionToken2(0)
        setIsComparingModel(false)
      } else {
        const data = response.data;
        const choices = data.choices;
        const responseModel2Content =
          (choices[0]?.message?.content as string) || "";
        setResponseModel2(responseModel2Content);
        if (responseModel2Content === "") {
          setIsRetryOverlay(true);
        }
        setResponseTime2(data.usage.response_time);
        setPromptToken(data.usage.prompt_tokens);
        setCompletionToken2(data.usage.completion_tokens);
      }

    },
    onError: (error) => {
      console.log("error2", error);
      setIsRetryOverlay(true);
    },
    onSettled: () => { },
  });

  const handleSendPrompt = useCallback(() => {
    setImages(() => newImages);
    if (!newMessage.trim()) {
      return;
    }
    recaptchaRef.current?.execute();

    if (selectedChoice) {
      handleDataSaving(selectedChoice.value);
      if (hasRoundEnded) {
        incrementRoundCounter();
      }
    }
    posthog?.capture("llm-compare.prompts.new", {
      prompt: newMessage,
    });
    setPrompt({ question: newMessage, tags: [] });
    setNewMessage("");
    setNewImages([]);
  }, [newMessage, selectedChoice]);

  const handleDataSaving = async (choice: string) => {
    handleUpload();

    let correctChoice = choice;
    if (choice === "A") {
      correctChoice = responseOrder?.choice1 === selectedModel1 ? "A" : "B";
    } else if (choice === "B") {
      correctChoice = responseOrder?.choice2 === selectedModel2 ? "B" : "A";
    }

    const { error } = await supabaseClient
      .from(DATABASE_TABLE.RESPONSE)
      .insert([
        {
          session_id: sessionId,
          selected_choice: correctChoice,
          model_1: selectedModel1,
          model_2: selectedModel2,
          response_model_1: responseModel1.replace(
            /<redacted>(.*?)<\/redacted>/g,
            "$1"
          ),
          response_model_2: responseModel2.replace(
            /<redacted>(.*?)<\/redacted>/g,
            "$1"
          ),
          prompt: prompt?.question,
          question_tags: prompt?.tags,
          response_time_1: responseTime1,
          response_time_2: responseTime2,
          prompt_token: promptToken,
          completion_token_1: completionToken1,
          completion_token_2: completionToken2,
          model_config: `{"system_prompt":"${systemPrompt}","temperature":${temperature},"top_p":${topP},"max_tokens":${maxTokens},"json_format":${jsonFormat}}`,
          image_namefile: images.map((file) => file.name),
          ideal_response: idealResponse,
          explain_choice: explainChoice,
        },
      ]);

    if (error) {
      console.log("error fetching", error);
    }
  };

  const payloadModel1 = useMemo<MessageRequest>(() => {
    return {
      model: selectedModel1,
      message: prompt?.question,
      images: convertedImages,
      config: {
        system_prompt: systemPrompt,
        temperature: temperature,
        top_p: topP,
        max_tokens: maxTokens,
        json_format: jsonFormat,
      },
    };
  }, [prompt, selectedModel1, convertedImages]);

  const payloadModel2 = useMemo<MessageRequest>(() => {
    return {
      model: selectedModel2,
      message: prompt?.question,
      images: convertedImages,
      config: {
        system_prompt: systemPrompt,
        temperature: temperature,
        top_p: topP,
        max_tokens: maxTokens,
        json_format: jsonFormat,
      },
    };
  }, [prompt, selectedModel2, convertedImages]);

  const isMobile = useIsMobile();

  useEffect(() => {
    if (prompt) {
      reset();
      mutateModel1(payloadModel1);
      mutateModel2(payloadModel2);
      setIsComparingModel(true);
    }
  }, [prompt]);

  useEffect(() => {
    if (sessionId === "") {
      const uuid = uuidv4();
      setSessionId(uuid);
    }
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [newMessage]);

  // Handle tooltip visibility with auto-hide timer
  useEffect(() => {
    let tooltipTimer: NodeJS.Timeout;

    if (isTooltipVisible) {
      tooltipTimer = setTimeout(() => {
        setIsTooltipVisible(false);
      }, 10000); // 10 seconds
    }

    return () => {
      if (tooltipTimer) clearTimeout(tooltipTimer);
    };
  }, [isTooltipVisible]);

  return (
    <div className="mx-auto mt-4 w-full flex-grow">
      <DataConsentModal />
      <Card className=" w-full mx-auto min-h-[69vh] rounded-xl bg-white flex-grow flex flex-col">
        <CardContent className="flex flex-col overflow-hidden flex-grow h-full p-1 relative">
          <PromptDisplay />
          {isRetryOverlay && (
            <div className="w-full absolute bottom-0 flex flex-col justify-center items-center z-50 bg-white/80 backdrop-blur-sm py-4">
              <div className="text-sm">An error has occurred</div>
              <Button
                className="bg-llm-primary50 hover:bg-llm-hover_primary50 text-white rounded-3xl"
                onClick={() => {
                  reset();
                  mutateModel1(payloadModel1);
                  mutateModel2(payloadModel2);
                  setIsComparingModel(true);
                }}
              >
                Retry
                <RotateCcw></RotateCcw>
              </Button>
            </div>
          )}
          <ModelResponses />
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="w-full space-y-4">
            {!isComparingModel && !(responseModel1 && responseModel2) && (
              <PromptSelector prompts={prompts} />
            )}
            <WinnerSelector />
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendPrompt();
              }}
              className="relative w-full flex flex-col"
            >
              <ReCAPTCHA
                ref={recaptchaRef}
                size="invisible"
                sitekey={process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY || ""}
              />
              <div className="flex flex-col w-full bg-white justify-center">
                <div className="flex justify-end pb-2 pr-2">
                  <IconButton
                    // This is a little custom logic that toggles the Tooltip text and icon
                    popoverContent={
                      isAIGenerationEnabled
                        ? "Disable AI-generated questions"
                        : "Generate your questions with AI!"
                    }
                    icon={isAIGenerationEnabled ? X : Wand}
                    open={isTooltipVisible}
                    // This will also control when the api is called or not for question generation
                    onClick={() => {
                      // Toggle the AI generation state
                      setIsAIGenerationEnabled(!isAIGenerationEnabled);
                      setUseAIGeneratedPrompt(!isAIGenerationEnabled);

                      // Make the tooltip visible when clicked
                      setIsTooltipVisible(true);
                    }}

                    delayOpen={150}
                  />
                </div>
                <div className="flex justify-center z-0">
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{
                      type: "spring",
                      stiffness: 1923,
                      damping: 188,
                      mass: 5,
                      duration: 1,
                    }}
                    className={`flex w-full -mb-5 border border-b-0 bg-gray-100 rounded-t-lg
          ${newImages.length > 0 ? "px-2 pt-1 pb-2 md:pb-6" : "mt-5"} h-fit`}
                  >
                    {newImages.length > 0 && (
                      <motion.div
                        layout
                        initial={{ opacity: 0, x: 0 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 25,
                          mass: 1,
                        }}
                        className="w-full flex flex-nowrap gap-4 py-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
                        style={{
                          minHeight: "96px",
                          scrollbarWidth: "thin",
                        }}
                      >
                        {newImages.map((file, index) => (
                          <motion.div
                            layout
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{
                              opacity: 0,
                              x: -50,
                              transition: {
                                type: "spring",
                                stiffness: 300,
                                damping: 25,
                                mass: 1,
                              },
                            }}
                            key={index}
                            className="relative flex-shrink-0"
                          >
                            <div className="w-14 h-14 md:w-20 md:h-20 relative">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Selected ${index + 1}`}
                                className="w-14 h-14 md:w-20 md:h-20 object-cover rounded-xl"
                              />
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleRemoveFile(index);
                                }}
                                className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full transition-opacity hover:bg-red-600"
                                aria-label={`Remove ${file.name}`}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </motion.div>
                </div>

                <div className="border z-10 bg-white p-1 flex flex-col rounded-xl">
                  <div>
                    <Textarea
                      ref={textareaRef}
                      value={newMessage}
                      disabled={
                        !(selectedModel1 && selectedModel2) || (isComparingModel && !isSingleModelMode) || isPendingModel1 || isPendingModel2
                      }
                      placeholder={
                        userChoices.length === 0
                          ? !isMobile
                            ? "Select a question to get started or ask your own here"
                            : "Ask a question"
                          : "Ask another question"
                      }
                      onChange={(e) => setNewMessage(e.target.value)}
                      rows={1}
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter" &&
                          !e.shiftKey &&
                          newMessage.trim().length !== 0
                        ) {
                          e.preventDefault();
                          handleSendPrompt();
                        }
                      }}
                      id="question-input"
                      className="flex-grow resize-none bg-transparent px-5 lg:min-h-12 max-h-24 w-full py-3 pr-12 focus:ring-0 focus:ring-offset-0 border-none focus:border-llm-primary50 focus-visible:ring-0 focus-visible:ring-offset-0 "
                    />
                  </div>
                  <div className="flex-row flex justify-between w-full mt-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      multiple
                      accept="image/*"
                      aria-label="Select images to upload"
                    />
                    <TooltipProvider delayDuration={150}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={(e) => {
                              e.preventDefault();
                              handleButtonClick();
                            }}
                            disabled={
                              !isModel1Multimodal ||
                              !isModel2Multimodal ||
                              (isComparingModel && !isSingleModelMode) ||
                              isPendingModel1 ||
                              isPendingModel2
                            }
                            size="icon"
                            className="rounded-lg justify-center w-8 h-8 p-0 text-llm-primary50 border border-llm-primary50 hover:bg-gray-100 bg-white focus-visible:outline-llm-primary50"
                          >
                            <Paperclip className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>Add images to prompt (max 3 images, 10MB each)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Button
                      type="submit"
                      size="icon"
                      disabled={
                        !(selectedModel1 && selectedModel2) ||
                        (isComparingModel && !isSingleModelMode) ||
                        isPendingModel1 ||
                        isPendingModel2 ||
                        newMessage.trim().length === 0
                      }
                      className="rounded-lg justify-center w-8 h-8 p-0 bg-llm-primary50 focus-visible:outline-llm-primary50"
                      onClick={handleSendPrompt}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
