"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import useAppStore from "@/hooks/store/useAppStore";
import * as animationData from "@/public/animation/loading";
import { useIsMutating } from "@tanstack/react-query";
import React, { useCallback, useEffect, useMemo } from "react";
import { IoInformationOutline } from "react-icons/io5";
import Lottie from "react-lottie";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const sanitizeMarkdown = (content: string | undefined) => {
  if (!content || typeof content !== "string") return "";

  // First ensure the content is properly stringified if it's an object
  const stringContent =
    typeof content === "object" ? JSON.stringify(content) : content;

  return stringContent
    .replace(/\\n/g, "\n")
    .replace(/\\\*/g, "*")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\")
    .replace(/,\[object Object\],/g, ""); // Remove problematic object literals
};

const MarkdownContent = ({ content }: { content: string }) => {
  const sanitizedContent = sanitizeMarkdown(content);
  const thinkMatch = /<think>([\s\S]*?)<\/think>/g.exec(sanitizedContent);
  const [isThinkOpen, setIsThinkOpen] = React.useState(false);

  // Remove think blocks from content and store them separately
  const cleanContent = sanitizedContent.replace(
    /<think>[\s\S]*?<\/think>/g,
    ""
  );
  const thinkContent = thinkMatch ? thinkMatch[1].trim() : null;

  return (
    <div>
      {thinkContent && (
        <div className="mb-4">
          <Button
            onClick={() => setIsThinkOpen(!isThinkOpen)}
            variant="outline"
            className="w-full justify-between"
          >
            <span>Thought Process</span>
            <span>{isThinkOpen ? "▼" : "▶"}</span>
          </Button>
          {isThinkOpen && (
            <div className="mt-2 p-4 bg-muted rounded-md">{thinkContent}</div>
          )}
        </div>
      )}
      <ReactMarkdown
        className="prose dark:prose-invert max-w-none"
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="mb-4">{children}</p>,
          ul: ({ children }) => (
            <ul className="list-disc ml-6 mb-4">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal ml-6 mb-4">{children}</ol>
          ),
        }}
      >
        {cleanContent}
      </ReactMarkdown>
    </div>
  );
};

export default function ModelResponses() {
  const [open, setOpen] = React.useState<boolean>(false);
  const [open2, setOpen2] = React.useState<boolean>(false);

  const {
    responseModel1,
    responseModel2,
    setModelOrder,
    selectedModel1,
    selectedModel2,
    responseOrder,
    isSingleModelMode,
  } = useAppStore();

  const mutationModel1 = useIsMutating({
    mutationKey: ["model1"],
  });

  const mutationModel2 = useIsMutating({
    mutationKey: ["model2"],
  });

  useEffect(() => {
    console.log(responseOrder)
  }, [responseOrder])

  const isPendingModel1 = useMemo(() => {
    return mutationModel1 > 0;
  }, [mutationModel1]);

  const isPendingModel2 = useMemo(() => {
    if (isSingleModelMode) return false
    return mutationModel2 > 0;
  }, [mutationModel2, isSingleModelMode]);

  const calculateMaxHeight = () => {
    return `calc(100vh - 460px)`;
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };


  return (
    <div className="flex-grow min-h-[10vh] ">
      <ScrollArea
        className={`absolute p-1 lg:px-6 h-full overflow-y-auto`}
        style={{ maxHeight: calculateMaxHeight() }}
      >
        {(isPendingModel1 || isPendingModel2) && (
          <div>
            <Lottie
              style={{ pointerEvents: "none" }}
              options={defaultOptions}
              height={300}
              width={300}
            ></Lottie>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4 h-full mb-2">
          <div className="model-a-response">
            {!isPendingModel1 && !isPendingModel2 && responseModel1 && (
              <div>
                <div className="flex w-full justify-between items-center">
                  <div className="w-fit bg-llm-neutral95 text-black p-1 my-2">
                    Model A
                  </div>
                  <TooltipProvider>
                    <Tooltip open={open}>
                      <TooltipTrigger asChild>
                        <Button
                          onMouseEnter={() => {
                            setOpen(!open);
                            setOpen2(false);
                          }}
                          onMouseLeave={() => {
                            setOpen(false);
                            setOpen2(false);
                          }}
                          className="w-5 h-5 p-2 rounded-full bg-transparent border border-llm-primary50 text-llm-primary50 hover:bg-llm-primary50 hover:text-white "
                        >
                          <IoInformationOutline />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <div className="w-72 text-justify">
                          We have redacted some words for further improvements
                          on blind test bias. You can view them after the test
                          ends!
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="p-2 rounded-lg bg-llm-grey4 border border-solid border-llm-neutral90 text-llm-response">
                  {responseOrder?.model && (
                    <MarkdownContent
                      content={responseOrder.model.replace(
                        /<redacted>(.+?)<\/redacted>/g,
                        (match: any, content: any) => "█".repeat(content.length)
                      )}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="model-b-response">
            {!isPendingModel1 && !isPendingModel2 && responseModel2 && (
              <div>
                <div className="flex w-full justify-between items-center">
                  <div className="w-fit bg-llm-neutral95 text-black p-1 my-2">
                    Model B
                  </div>
                  <TooltipProvider>
                    <Tooltip open={open2}>
                      <TooltipTrigger asChild>
                        <Button
                          onMouseEnter={() => {
                            setOpen2(!open);
                            setOpen(false);
                          }}
                          onMouseLeave={() => {
                            setOpen2(false);
                            setOpen(false);
                          }}
                          className="w-5 h-5 p-2 rounded-full bg-transparent border border-llm-primary50 text-llm-primary50 hover:bg-llm-primary50 hover:text-white "
                        >
                          <IoInformationOutline />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <div className="w-72 text-justify">
                          We have redacted some words for further improvements
                          on blind test bias. You can view them after the test
                          ends!
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                {/* <Button variant="link">@nextjs</Button> */}
                <div className="p-2 rounded-lg bg-llm-grey4 text-llm-response border border-solid border-llm-neutral90">
                  {responseOrder?.otherModel && (
                    <MarkdownContent
                      content={responseOrder.otherModel.replace(
                        /<redacted>(.+?)<\/redacted>/g,
                        (match: any, content: any) => "█".repeat(content.length)
                      )}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
