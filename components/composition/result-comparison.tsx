"use client";

import React, { useState } from "react";
import { Message } from "@/lib/types/message";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

import ReactMarkdown from "react-markdown";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "../ui/scroll-area";
import remarkGfm from "remark-gfm";
import {
  FloatingPanelContent,
  FloatingPanelRoot,
  FloatingPanelTrigger,
} from "../ui/floating-panel";
import { CheckIcon, XIcon } from "lucide-react";

interface DataProps {
  allMessage: Message[];
  modelA: string;
  modelB: string;
  isLoading: boolean;
}

const ResultComparison = ({
  allMessage,
  modelA,
  modelB,
  isLoading,
}: DataProps) => {
  const [currentMessage, setCurrentMessage] = useState<number>(0);

  const calculateMaxHeight = () => {
    return `calc(100vh - 460px)`;
  };

  return (
    <div className="flex-row w-full border flex-grow bg-white rounded-xl">
      {isLoading ? (
        <div className="flex flex-col p-5 ">
          <Skeleton className="w-full h-5 p-4 border border-gray-200 rounded-xl mb-5" />
          <div className="flex gap-4 w-full">
            <div className="flex flex-col w-full">
              <Skeleton className="w-32 h-5 p-3 border border-gray-200 rounded-xl mb-5" />
              <Skeleton className="w-full h-96 p-3 border border-gray-200 rounded-xl" />
            </div>
            <div className="flex flex-col w-full">
              <Skeleton className="w-32 h-5 p-3 border border-gray-200 rounded-xl mb-5" />
              <Skeleton className="w-full h-96 p-3 border border-gray-200 rounded-xl" />
            </div>
          </div>
        </div>
      ) : (
        <div>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Test Summary</CardTitle>
              <CardDescription>
                Prompt, Model Output, and Selected Choice
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <FloatingPanelRoot className="w-full">
                  <FloatingPanelTrigger
                    title="Prompt"
                    className="focus-visible:outline-llm-primary50"
                  >
                    <div className="bg-llm-grey4 p-1 mx-auto w-full text-center border border-solid border-llm-neutral90 rounded-xl text-llm-grey1 h-fit whitespace-pre-wrap line-clamp-1 focus-visible:outline-llm-primary50">
                      {allMessage[currentMessage].prompt}
                    </div>
                  </FloatingPanelTrigger>
                  <FloatingPanelContent>
                    {allMessage[currentMessage].prompt}
                  </FloatingPanelContent>
                </FloatingPanelRoot>
                <ScrollArea
                  className={`flex-grow lg:p-4 p-1 overflow-y-auto`}
                  style={{ maxHeight: calculateMaxHeight(), height: "500px" }}
                >
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div className="model-a-response">
                      <div className="w-full bg-llm-neutral95 text-black p-1 my-2 text-center flex justify-center font-semibold">
                        {modelA}
                        {allMessage[currentMessage].choice === "AB" ||
                        allMessage[currentMessage].choice === "A" ? (
                          <div className="bg-green-500 rounded-full mx-2">
                            <CheckIcon className="text-white p-1" />
                          </div>
                        ) : (
                          <div className="bg-red-500 rounded-full mx-2">
                            <XIcon className="text-white p-1" />
                          </div>
                        )}
                      </div>
                      <div className="p-2 rounded-lg bg-llm-grey4 border border-solid border-llm-neutral90 text-llm-response">
                        <ReactMarkdown
                          className="prose dark:prose-invert"
                          remarkPlugins={[remarkGfm]}
                        >
                          {allMessage[currentMessage].response1}
                        </ReactMarkdown>
                      </div>
                    </div>
                    <div className="model-b-response">
                      <div className="w-full bg-llm-neutral95 text-black p-1 my-2 text-center flex justify-center font-semibold">
                        {modelB}
                        {allMessage[currentMessage].choice === "AB" ||
                        allMessage[currentMessage].choice === "B" ? (
                          <div className="bg-green-500 rounded-full mx-2">
                            <CheckIcon className="text-white p-1" />
                          </div>
                        ) : (
                          <div className="bg-red-500 rounded-full mx-2">
                            <XIcon className="text-white p-1" />
                          </div>
                        )}
                      </div>
                      <div className="p-2 rounded-lg bg-llm-grey4 border border-solid border-llm-neutral90 text-llm-response">
                        <ReactMarkdown
                          className="prose dark:prose-invert"
                          remarkPlugins={[remarkGfm]}
                        >
                          {allMessage[currentMessage].response2}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
                <div className="w-full lg:bg-llm-grey4 py-2 mt-2">
                  <div className="flex justify-center w-full">
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentMessage(currentMessage - 1);
                        }}
                        disabled={currentMessage === 0}
                        className="w-full rounded-xl border border-solid border-llm-primary95 hover:bg-llm-primary50 hover:text-white text-llm-primary50 bg-llm-primary95 py-3 px-5 cursor-pointer "
                      >
                        Previous
                      </Button>
                      <div className="text-center flex justify-center items-center">
                        {currentMessage + 1} of {allMessage.length}
                      </div>
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentMessage(currentMessage + 1);
                        }}
                        disabled={
                          allMessage.length === 1 ||
                          currentMessage === allMessage.length - 1
                        }
                        className="w-full rounded-xl border border-solid border-llm-primary95 hover:bg-llm-primary50 hover:text-white text-llm-primary50 bg-llm-primary95 py-3 px-5 cursor-pointer "
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ResultComparison;
