"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Send } from "lucide-react";
import PromptSelector from "./promp-selector";
import { MessageRequest } from "@/lib/types/message";
import ModelResponses from "./model-responses";
import PromptDisplay from "../ui/chat/prompt-display";
import useAppStore from "@/hooks/store/useAppStore";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "@/lib/constants/urls";
import { Textarea } from "../ui/textarea";
import WinnerSelector from "./winner-selector";
import { v4 as uuidv4 } from "uuid";

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
  } = useAppStore();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
      setResponseTime1(data.usage.response_time);
      setPromptToken(data.usage.prompt_tokens);
      setCompletionToken1(data.usage.completion_tokens);
      console.log("data1", data);
    },
    onError: (error) => {
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
      setResponseTime2(data.usage.response_time);
      setPromptToken(data.usage.prompt_tokens);
      setCompletionToken2(data.usage.completion_tokens);
      console.log("data2", data);
    },
    onError: (error) => {
      console.log("error2", error);
    },
    onSettled: () => {},
  });

  const [newMessage, setNewMessage] = useState<string>("");

  const handleSendPrompt = useCallback(() => {
    setPrompt(newMessage);
  }, [newMessage]);

  const payloadModel1 = useMemo<MessageRequest>(() => {
    return {
      model: selectedModel1,
      message: prompt,
    };
  }, [prompt, selectedModel1]);

  const payloadModel2 = useMemo<MessageRequest>(() => {
    return {
      model: selectedModel2,
      message: prompt,
    };
  }, [prompt, selectedModel2]);

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
      <Card className=" w-full mx-auto border rounded-lg  bg-white flex-grow h-full flex flex-col">
        <CardContent className="flex flex-col flex-grow overflow-hidden p-1 h-full">
          <PromptDisplay />

          <ModelResponses />
        </CardContent>
        <CardFooter className="flex flex-col gap-2 pb-4">
          {selectedModel1 && selectedModel2 && (
            <PromptSelector prompts={prompts} />
          )}
          <WinnerSelector />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendPrompt();
            }}
            className="relative w-full "
          >
            <Textarea
              ref={textareaRef}
              value={newMessage}
              disabled={!(selectedModel1 && selectedModel2) || isComparingModel}
              placeholder={
                userChoices.length === 0
                  ? "Select a question to get started or ask your own here"
                  : "Ask another question"
              }
              onChange={(e) => setNewMessage(e.target.value)}
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  setPrompt(newMessage);
                  setNewMessage("");
                }
              }}
              style={{
                minHeight: "3rem",
                maxHeight: "6rem",
              }}
              className="flex-grow resize-none rounded-md px-5 w-full py-3 pr-12 focus:ring-0 focus:ring-offset-0 border border-solid focus:border-llm-primary50 focus-visible:ring-0 focus-visible:ring-offset-0 "
            />
            <Button
              type="submit"
              size="icon"
              disabled={!(selectedModel1 && selectedModel2) || isComparingModel}
              className="absolute right-5 top-1/2 -translate-y-1/2 rounded-full w-8 h-8 p-0 bg-llm-primary50"
              onClick={handleSendPrompt}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
