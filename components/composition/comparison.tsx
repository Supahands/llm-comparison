"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Send } from "lucide-react";
import PromptSelector from "./promp-selector";
import { Message, MessageRequest } from "@/lib/types/message";
import ModelResponses from "./model-responses";
import PromptDisplay from "../ui/chat/prompt-display";
import useAppStore from "@/hooks/store/useAppStore";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "@/lib/constants/urls";
import { Textarea } from "../ui/textarea";

const prompts = [
  "What are the most popular car brands in Japan?",
  "Gather the top insights on the Southeast Asian vehicle market",
  "Give me the latest updates on the US Presidential elections",
  "Compare the education system in the UK vs the USA",
];

const randomMarkdownMessages = [
  "## Hello! 🌟\n\nThis is a sample markdown message.",
  "**Here’s a bold statement**",
  "1. First item\n2. Second item\n3. Third item",
  "> This is a quote",
  "`const codeSnippet = 'example'`",
  "Check out [OpenAI](https://openai.com)!",
  "This is **another** markdown message.",
  "Here's some `inline code` for you.",
  "### Section Header\nWith some description.",
  "> This is another quote block with more information.",
];

export default function Comparison() {
  const {
    prompt,
    setPrompt,
    selectedModel1,
    selectedModel2,
    setResponseModel1,
    setResponseModel2,
    setIsComparingModel,
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
      mutateModel1(payloadModel1);
      mutateModel2(payloadModel2);
      setIsComparingModel(true);
    }
  }, [prompt]);

  useEffect(() => {
    if (textareaRef.current) {
      // TypeScript now recognizes textareaRef.current as HTMLTextAreaElement
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
              disabled={!(selectedModel1 && selectedModel2)}
              placeholder="Select a question to get started or ask your own here"
              onChange={(e) => setNewMessage(e.target.value)}
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  setPrompt(newMessage);
                }
              }}
              style={{
                minHeight: "1.75rem",
                maxHeight: "6rem", 
              }}
              className="flex-grow resize-none rounded-md px-5 w-full py-3 pr-12 focus:ring-0 focus:ring-offset-0 border border-solid focus:border-llm-primary50 focus-visible:ring-0 focus-visible:ring-offset-0 "
            />
            <Button
              type="submit"
              size="icon"
              disabled={!(selectedModel1 && selectedModel2)}
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
