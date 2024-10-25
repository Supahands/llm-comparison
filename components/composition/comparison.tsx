"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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

const prompts = [
  "What are the most popular car brands in Japan?",
  "Gather the top insights on the Southeast Asian vehicle market",
  "Give me the latest updates on the US Presidential elections",
  "Compare the education system in the UK vs the USA",
];

export default function Comparison() {
  const [messages, setMessages] = useState<Message[]>([]);
  const { prompt, setPrompt, selectedModel1, selectedModel2 } = useAppStore();

  const {
    isPending: isPendingModel1,
    isSuccess: isSuccessModel1,
    data: dataModel1,
    mutate: mutateModel1,
  } = useMutation({
    mutationFn: (data: MessageRequest) => {
      return axios.post(`${API_URL}/message`, data);
    },
    onSuccess: async (data) => {
      console.log("data1", data);
    },
  });

  const {
    isPending: isPendingModel2,
    isSuccess: isSuccessModel2,
    data: dataModel2,
    mutate: mutateModel2,

  } = useMutation({
    mutationFn: (data: MessageRequest) => {
      return axios.post(`${API_URL}/message`, data);
    },
    onSuccess: async (data) => {
      console.log("data2", data);
    },
  });

  const [newMessage, setNewMessage] = useState<string>("");

  const handleSendPrompt = useCallback(() => {
    setPrompt(newMessage);
  }, [newMessage]);

  useEffect(() => {
    console.log('isPendingModel1', isPendingModel1)
    console.log('isPendingModel2', isPendingModel2)
  }, [isPendingModel1, isPendingModel2])

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
    if (prompt && selectedModel1 && selectedModel2) {
      mutateModel1(payloadModel1);
      mutateModel2(payloadModel2);
    }
  }, [prompt, selectedModel1, selectedModel2]);

  return (
    <div className="mx-auto mt-4">
      <Card className=" w-full mx-auto border rounded-lg  bg-white">
        <CardContent className="flex flex-col h-[500px] overflow-hidden p-1">
          <PromptDisplay />
          <ModelResponses isPendingModel1={isPendingModel1} isPendingModel2={isPendingModel2} messages={[]}/>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
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
            <Input
              type="text"
              placeholder="Select a question to get started or ask your own here"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full pr-12 h-fit px-5 py-4 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-5 top-1/2 -translate-y-1/2 rounded-full w-8 h-8 p-0 bg-llm-primary50"
              onClick={handleSendPrompt}
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
