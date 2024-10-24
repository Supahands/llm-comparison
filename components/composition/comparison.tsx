"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Send } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import ReactMarkdown from "react-markdown";
import PromptSelector from "./promp-selector";
import { Message } from "@/lib/types/message";
import ModelResponses from "./model-responses";
import PromptDisplay from "../ui/chat/prompt-display";
import useAppStore from "@/hooks/store/useAppStore";

const generateMessages = (): Message[] => {
  const messages: Message[] = [];
  const prompt = "What are the most popular car brands in Japan?";

  messages.push({
    id: Math.random() * 1000,
    prompt,
    responseA: `The most popular vehicle make and model in Japan can vary depending on the year and the source of the data. However, based on historical sales data and market research, the following are some of the most popular vehicle makes and models in Japan:
\n1. **Toyota Corolla**: The Toyota Corolla is one of the best-selling cars in Japan, and it has been a popular choice for many years. It is a compact sedan that is known for its reliability, fuel efficiency, and affordability.
\n2. **Toyota Prius**: The Toyota Prius is a hybrid electric vehicle that is very popular in Japan. It is known for its fuel efficiency and environmental friendliness, and it has been a top seller in Japan for many years.
\n3. **Honda Fit**: The Honda Fit is a subcompact car that is popular in Japan due to its compact size, fuel efficiency, and affordability. It is also known for its spacious interior and versatile cargo area.
\n4. **Nissan Note**: The Nissan Note is a subcompact car that is popular in Japan due to its stylish design, fuel efficiency, and affordability. It is also known for its advanced safety features and comfortable ride.
\n5. **Toyota Aqua**: The Toyota Aqua is a hybrid electric vehicle that is popular in Japan due to its fuel efficiency and environmental friendliness. It is a compact car that is known for its stylish design and advanced safety features.
`,
    responseB: `According to data from the Japan Automobile Dealers Association, the top 5 best-selling cars in Japan in 2022 were:
      \n1. **Toyota Corolla** (83,477 units sold)
      \n2. **Toyota Prius** (73,011 units sold)
      \n3. **Honda Fit** (64,162 units sold)
      \n4. **Nissan Note** (59,329 units sold)
      \n5. **Toyota Aqua** (55,919 units sold)
It's worth noting that the popularity of vehicles in Japan can vary depending on the region and the time of year, so these figures are subject to change.`,
  });

  return messages;
};

const prompts = [
  "What are the most popular car brands in Japan?",
  "Gather the top insights on the Southeast Asian vehicle market",
  "Give me the latest updates on the US Presidential elections",
  "Compare the education system in the UK vs the USA",
];

export default function Comparison() {
  const [messages, setMessages] = useState<Message[]>([]);
  const { prompt, setPrompt } = useAppStore();

  useEffect(() => {
    setMessages(generateMessages());
  }, []);

  const [newMessage, setNewMessage] = useState<string>("");

  const handleSendPrompt = useCallback(() => {
    setPrompt(newMessage);
  }, [newMessage]);

  const handlePromptSelect = (val: string) => {
    setPrompt(val);
  }

  useEffect(() => {
    //trigger prompt update
  }, [prompt])

  return (
    <div className="mx-auto mt-4">
      <Card className=" w-full mx-auto border rounded-lg  bg-white">
        <CardContent className="flex flex-col h-[500px] overflow-hidden p-1">
          <PromptDisplay/>
          <ModelResponses messages={messages} />
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <PromptSelector prompts={prompts} />
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
