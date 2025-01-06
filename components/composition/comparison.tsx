"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Send, RotateCcw } from "lucide-react";
import PromptSelector from "./promp-selector";
import { MessageRequest } from "@/lib/types/message";
import ModelResponses from "./model-responses";
import PromptDisplay from "./prompt-display";
import useAppStore from "@/hooks/store/useAppStore";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "@/lib/constants/urls";
import { Textarea } from "../ui/textarea";
import WinnerSelector from "./winner-selector";
import { v4 as uuidv4 } from "uuid";
import { supabaseClient } from "@/lib/supabase/supabaseClient";
import DataConsentModal from "./data-consent-modal";
import { useIsMobile } from "@/hooks/use-mobile";
import { DATABASE_TABLE } from "@/lib/constants/databaseTables";
import { usePostHog } from "posthog-js/react";
import ReCAPTCHA from "react-google-recaptcha";
import { Paperclip } from "lucide-react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

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
  } = useAppStore();

  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const posthog = usePostHog();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function uploadFiles(formData: FormData) {
    const files = formData.getAll("files") as File[];
    if (files.length === 0) {
      return { success: false, message: "No files uploaded" };
    }

    const uploadedFiles = files.map((file) => {
      console.log("File uploaded:", file.name, "Size:", file.size, "bytes");
      return file.name;
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      success: true,
      message: `${files.length} file(s) uploaded successfully!`,
      files: uploadedFiles,
    };
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  }

  function handleRemoveFile(index: number) {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  }

  async function handleUpload() {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    setMessage(null);

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("files", file));

    const result = await uploadFiles(formData);
    setMessage(result.message);
    setIsUploading(false);

    if (result.success) {
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function handleButtonClick() {
    fileInputRef.current?.click();
  }

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
      return axios.post(`${API_URL}/message`, data);
    },
    onSuccess: async (response) => {
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
    },
    onError: (error) => {
      console.log("error2", error);
      setIsRetryOverlay(true);
    },
    onSettled: () => {},
  });

  const [newMessage, setNewMessage] = useState<string>("");

  const handleSendPrompt = useCallback(() => {
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
    setPrompt(newMessage);
    setNewMessage("");
  }, [newMessage, selectedChoice]);

  const handleDataSaving = async (choice: string) => {
    let correctChoice = choice;

    if (choice === "A") {
      correctChoice = responseOrder?.order === "1" ? "A" : "B";
    } else if (choice === "B") {
      correctChoice = responseOrder?.order === "2" ? "B" : "A";
    }
    const { error } = await supabaseClient
      .from(DATABASE_TABLE.RESPONSE)
      .insert([
        {
          session_id: sessionId,
          selected_choice: choice,
          model_1: selectedModel1,
          model_2: selectedModel2,
          response_model_1: responseModel1.replace(
            /<redacted>.*?<\/redacted>/g,
            ""
          ),
          response_model_2: responseModel2.replace(
            /<redacted>.*?<\/redacted>/g,
            ""
          ),
          prompt: prompt,
          response_time_1: responseTime1,
          response_time_2: responseTime2,
          prompt_token: promptToken,
          completion_token_1: completionToken1,
          completion_token_2: completionToken2,
          model_config: `{"system_prompt":"${systemPrompt}","temperature":${temperature},"top_p":${topP},"max_tokens":${maxTokens},"json_format":${jsonFormat}}`,
        },
      ]);

    if (error) {
      console.log("error fetching", error);
    }
  };

  const payloadModel1 = useMemo<MessageRequest>(() => {
    return {
      model: selectedModel1,
      message: prompt,
      config: {
        system_prompt: systemPrompt,
        temperature: temperature,
        top_p: topP,
        max_tokens: maxTokens,
        json_format: jsonFormat,
      },
    };
  }, [prompt, selectedModel1]);

  const payloadModel2 = useMemo<MessageRequest>(() => {
    return {
      model: selectedModel2,
      message: prompt,
      config: {
        system_prompt: systemPrompt,
        temperature: temperature,
        top_p: topP,
        max_tokens: maxTokens,
        json_format: jsonFormat,
      },
    };
  }, [prompt, selectedModel2]);

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

  return (
    <div className="mx-auto mt-4 w-full flex-grow">
      <DataConsentModal />
      <Card className=" w-full mx-auto rounded-xl h-[69vh] bg-white flex-grow flex flex-col">
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
        <CardFooter className="flex flex-col gap-3 pb-4">
          {selectedModel1 && selectedModel2 && (
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
              <div className="flex justify-center z-0">
                <motion.div
                  layout
                  initial={{ opacity: 0, y: -50 }} // Animation when it enters
                  animate={{ opacity: 1, y: 0 }} // Animation while it's visible
                  exit={{ opacity: 0, y: 50 }} // Animation when it exits
                  transition={{
                    type: "spring",
                    stiffness: 1923,
                    damping: 188,
                    mass: 5,
                  }}
                  className={`flex border w-full -mb-5 border-b-0 bg-gray-100 rounded-t-lg
                     ${
                       selectedFiles.length > 0 ? "px-3 pt-3 pb-8" : "mt-5"
                     } h-fit`}
                >
                  {selectedFiles.length > 0 && (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -50 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                        mass: 1,
                      }}
                      className="flex flex-row gap-4"
                    >
                      {selectedFiles.map((file, index) => (
                        <motion.div
                          layout
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -50 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 25,
                            mass: 1,
                          }}
                          key={index}
                          className="relative group"
                        >
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Selected ${index + 1}`}
                            className="w-full h-20 object-cover rounded-xl"
                          />
                          <button
                            onClick={() => handleRemoveFile(index)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label={`Remove ${file.name}`}
                          >
                            <X className="w-4 h-4" />
                          </button>
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
                      !(selectedModel1 && selectedModel2) || isComparingModel
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
                  <Button
                    onClick={handleButtonClick}
                    size="icon"
                    className="rounded-lg justify-center w-8 h-8 p-0 text-llm-primary50 border border-llm-primary50 bg-white focus-visible:outline-llm-primary50"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button
                    type="submit"
                    size="icon"
                    disabled={
                      !(selectedModel1 && selectedModel2) ||
                      isComparingModel ||
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
        </CardFooter>
      </Card>
    </div>
  );
}
