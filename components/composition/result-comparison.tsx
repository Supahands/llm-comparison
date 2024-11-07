"use client";

import React, { useEffect, useRef, useState } from "react";
import { Message } from "@/lib/types/message";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa6";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

import ReactMarkdown from "react-markdown";
import AutoHeight from "embla-carousel-auto-height";
import { useIsMobile } from "@/hooks/use-mobile";

interface dataProps {
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
}: dataProps) => {
  const isMobile = useIsMobile();
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
              <Carousel>
                <CarouselContent>
                  {allMessage.map((item, index) => (
                    <CarouselItem key={item.id}>
                      <div className="flex flex-col w-full">
                        <div className="flex mb-2">
                          {item.prompt && (
                            <div className="bg-llm-grey4 p-1 mx-auto w-full text-center border border-solid border-llm-neutral90 rounded-xl text-llm-grey1 h-fit">
                              {item.prompt}
                            </div>
                          )}
                        </div>
                        <div className="flex lg:flex-row flex-col gap-4 mb-4">
                          <div className="w-full space-y-1">
                            <div className="model-b-response ">
                              <div className="flex justify-between items-center">
                                <div className="w-fit flex flex-grow items-center gap-4 bg-llm-neutral95 text-black font-bold text-lg p-1 my-2 h-fit">
                                  {modelA}
                                  {item.choice?.includes("A") &&
                                  !item.choice?.includes("!") ? (
                                    <FaThumbsUp color="green" />
                                  ) : (
                                    <FaThumbsDown color="red" />
                                  )}
                                </div>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button className="bg-llm-primary50 hover:bg-llm-primary50_hover text-base font-bold rounded-xl">
                                      Model Output
                                    </Button>
                                  </DialogTrigger>

                                  <DialogContent className="lg:w-[600px] max-h-full lg:min-w-fit lg:max-w-full max-w-[90%] overflow-auto">
                                    <DialogHeader>{modelA}</DialogHeader>
                                    <div
                                      className={`lg:p-5 rounded-lg bg-llm-grey4 text-llm-response border-2 border-solid w-fit
                                        ${
                                          item.choice?.includes("A") &&
                                          !item.choice?.includes("!")
                                            ? "border-green-600"
                                            : "border-llm-btn_hover"
                                        }`}
                                    >
                                      <ReactMarkdown className="prose dark:prose-invert text-wrap whitespace-pre max-w-[300px] lg:max-w-full">
                                        {item.response1}
                                      </ReactMarkdown>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </div>
                          </div>
                          <div className="w-full space-y-1 ">
                            <div className="model-b-response ">
                              <div className="flex justify-between items-center">
                                <div className="w-fit flex flex-grow items-center gap-4 bg-llm-neutral95 text-black font-bold text-lg p-1 my-2 h-fit">
                                  {modelB}
                                  {item.choice?.includes("B") &&
                                  !item.choice?.includes("!") ? (
                                    <FaThumbsUp color="green" />
                                  ) : (
                                    <FaThumbsDown color="red" />
                                  )}
                                </div>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button className="bg-llm-primary50 hover:bg-llm-primary50_hover text-base font-bold rounded-xl">
                                      Model Output
                                    </Button>
                                  </DialogTrigger>

                                  <DialogContent className="lg:w-[600px] max-h-full lg:min-w-fit lg:max-w-full max-w-[90%] overflow-auto">
                                    <DialogHeader>{modelA}</DialogHeader>
                                    <div
                                      className={`lg:p-5 rounded-lg bg-llm-grey4 text-llm-response border-2 border-solid w-fit
                                        ${
                                          item.choice?.includes("B") &&
                                          !item.choice?.includes("!")
                                            ? "border-green-600"
                                            : "border-llm-btn_hover"
                                        }`}
                                    >
                                      <ReactMarkdown className="prose dark:prose-invert text-wrap whitespace-pre max-w-[350px] lg:max-w-full">
                                        {item.response2}
                                      </ReactMarkdown>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {isMobile && (
                  <div className="text-center text-sm">
                    Swipe to view other responses
                  </div>
                )}
                <CarouselPrevious className="hidden lg:inline-flex" />
                <CarouselNext className="hidden lg:inline-flex" />
              </Carousel>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ResultComparison;
