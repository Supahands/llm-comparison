"use client";

import { Message } from "@/lib/types/message";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";

import { motion } from "framer-motion";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

import TagPill from "@/components/ui/tag-pill";
import { useIsMobile } from "@/hooks/use-mobile";
import { CheckIcon, XIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  FloatingPanelContent,
  FloatingPanelRoot,
  FloatingPanelTrigger,
} from "../ui/floating-panel";
import { ScrollArea } from "../ui/scroll-area";

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
  console.log("🚀 ~ allMessage:", allMessage)
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
                    className="focus-visible:outline-llm-primary50 bg-transparent"
                  >
                    <div className="bg-llm-grey4 p-1 mx-auto w-full text-center border border-solid border-llm-neutral90 rounded-xl text-llm-grey1 h-fit whitespace-pre-wrap line-clamp-1 focus-visible:outline-llm-primary50">
                      <div>{allMessage[currentMessage].prompt}</div>
                      {allMessage[currentMessage].question_tags && allMessage[currentMessage].question_tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 justify-center mt-1">
                          {allMessage[currentMessage].question_tags.map((tag: string) => (
                            <TagPill key={tag} tag={tag} size="sm" />
                          ))}
                        </div>
                      )}
                    </div>
                  </FloatingPanelTrigger>
                  <FloatingPanelContent>
                    <div>
                      {allMessage[currentMessage].image_url.length > 0 && (
                        <div>
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
                            {allMessage[currentMessage].image_url?.map(
                              (url, index) => (
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
                                  <div className="w-20 h-20 relative">
                                    <img
                                      src={url}
                                      alt={`Selected ${index + 1}`}
                                      className="w-20 h-20 object-cover rounded-xl"
                                    />
                                  </div>
                                </motion.div>
                              )
                            )}
                          </motion.div>
                        </div>
                      )}
                      <div>{allMessage[currentMessage].prompt}</div>
                      {allMessage[currentMessage].question_tags && allMessage[currentMessage].question_tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {allMessage[currentMessage].question_tags.map((tag: string) => (
                            <TagPill key={tag} tag={tag} />
                          ))}
                        </div>
                      )}
                    </div>
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
                  <div className="space-y-2">
                    <div className="flex w-full flex-col  h-full flex-grow">
                      <div className="flex flex-col h-full flex-grow gap-2">
                        <p className="font-bold text-sm md:text-base">
                          Explanation
                        </p>
                        <ScrollArea className="flex-grow w-full border text-sm lg:text-base h-20 border-gray-300 p-2 md:p-3 rounded-xl ">
                          {allMessage
                            ? allMessage[currentMessage].explain_choice
                            : ""}
                        </ScrollArea>
                      </div>
                    </div>
                    <div className="flex w-full flex-col  h-full flex-grow">
                      <div className="flex flex-col h-full flex-grow gap-2">
                        <p className="font-bold text-sm md:text-base">
                          Ideal Response
                        </p>
                        <ScrollArea className="flex-grow w-full border text-sm lg:text-base h-20 border-gray-300 p-2 md:p-3 rounded-xl ">
                          {allMessage
                            ? allMessage[currentMessage].explain_choice
                            : ""}
                        </ScrollArea>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
                <div className="w-full lg:bg-llm-grey4 py-2 mt-2">
                  <div className="flex justify-center w-full">
                    <div className="grid grid-cols-3 gap-2">
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
