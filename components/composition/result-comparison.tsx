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

import { Skeleton } from "@/components/ui/skeleton";

import ReactMarkdown from "react-markdown";

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [carouselHeight, setCarouselHeight] = useState("auto");
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (carouselRef.current) {
      setCarouselHeight(`${carouselRef.current.scrollHeight}px`);
    }
  }, [currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % allMessage.length);
  };

  const previousSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? allMessage.length - 1 : prevIndex - 1
    );
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
        <Carousel
          style={{ height: carouselHeight, transition: "height 0.3s ease" }}
        >
          <CarouselContent
            ref={carouselRef}
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {allMessage.map((item, index) => (
              <CarouselItem className="">
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
                        <div className="w-fit flex items-center gap-4 bg-llm-neutral95 text-black font-bold text-lg p-1 my-2">
                          {modelA}
                          {item.choice?.includes("A") &&
                          !item.choice?.includes("!") ? (
                            <FaThumbsUp color="green" />
                          ) : (
                            <FaThumbsDown color="red" />
                          )}
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
                        <div className="w-fit flex items-center gap-4 bg-llm-neutral95 text-black font-bold text-lg p-1 my-2">
                          {modelB}
                          {item.choice?.includes("B") &&
                          !item.choice?.includes("!") ? (
                            <FaThumbsUp color="green" />
                          ) : (
                            <FaThumbsDown color="red" />
                          )}
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
          <CarouselPrevious onClick={previousSlide} />
          <CarouselNext onClick={nextSlide} />
        </Carousel>
      )}
    </div>
  );
};

export default ResultComparison;
