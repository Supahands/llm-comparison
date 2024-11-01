"use client";

import React, { useEffect } from "react";
import { Message } from "@/lib/types/message";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import ReactMarkdown from "react-markdown";

interface dataProps {
  allMessage: Message[];
  modelA: string;
  modelB: string;
}

const ResultComparison = ({ allMessage, modelA, modelB }: dataProps) => {
  return (
    <div className="flex-row w-full border flex-grow bg-white rounded-xl">
      <Carousel>
        <CarouselContent>
          {allMessage.map((item, index) => (
            <CarouselItem>
              <div className="flex flex-col w-full p-5">
                <div className="mt-2 flex-1">
                  {item.prompt && (
                    <div className="bg-llm-grey4 p-1 mx-auto w-full text-center border border-solid border-llm-neutral90 rounded-xl text-llm-grey1 h-fit">
                      {item.prompt}
                    </div>
                  )}
                </div>
                <div className="flex gap-4 mb-4">
                  <div className="w-full space-y-1">
                    <div className="model-b-response ">
                      <div className="w-fit bg-llm-neutral95 text-black font-bold text-lg p-1 my-2">
                        {modelA}
                      </div>
                      <div
                        className={`p-5 rounded-lg bg-llm-grey4 text-llm-response border-2 border-solid 
                      ${
                        item.choice?.includes("A") &&
                        !item.choice?.includes("!")
                          ? "border-green-600"
                          : "border-llm-btn_hover"
                      }`}
                      >
                        <ReactMarkdown className="prose dark:prose-invert">
                          {item.response1}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                  <div className="w-full space-y-1 ">
                    <div className="model-b-response ">
                      <div className="w-fit bg-llm-neutral95 text-black font-bold text-lg p-1 my-2">
                        {modelB}
                      </div>
                      <div
                        className={`p-5 rounded-lg bg-llm-grey4 text-llm-response border-2 border-solid 
                      ${
                        item.choice?.includes("B") &&
                        !item.choice?.includes("!")
                          ? "border-green-600"
                          : "border-llm-btn_hover"
                      }`}
                      >
                        <ReactMarkdown className="prose dark:prose-invert">
                          {item.response2}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default ResultComparison;
