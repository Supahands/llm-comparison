"use client";

import { ScrollArea } from "../ui/scroll-area";
import ReactMarkdown from "react-markdown";
import useAppStore from "@/hooks/store/useAppStore";
import { useIsMutating } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import remarkGfm from "remark-gfm";
import Lottie from "react-lottie";
import * as animationData from "../../public/animation/loading";
import React from "react";
import { Button } from "@/components/ui/button";
import { IoInformationOutline } from "react-icons/io5";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ModelResponses() {
  const [open, setOpen] = React.useState<boolean>(false);
  const [open2, setOpen2] = React.useState<boolean>(false);

  const { responseModel1, responseModel2, setModelOrder } = useAppStore();

  const mutationModel1 = useIsMutating({
    mutationKey: ["model1"],
  });

  const mutationModel2 = useIsMutating({
    mutationKey: ["model2"],
  });

  const isPendingModel1 = useMemo(() => {
    return mutationModel1 > 0;
  }, [mutationModel1]);

  const isPendingModel2 = useMemo(() => {
    return mutationModel2 > 0;
  }, [mutationModel2]);

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

  const randomizeResponses = useCallback(() => {
    return Math.random() < 0.5
      ? { model: responseModel1, otherModel: responseModel2, order: "1" }
      : { model: responseModel2, otherModel: responseModel1, order: "2" };
  }, [responseModel1, responseModel2]);

  const responses = useMemo(() => {
    const random = randomizeResponses();
    setModelOrder(random);
    return random;
  }, [randomizeResponses]);

  return (
    <div>
      <ScrollArea
        className={`flex-grow lg:p-4 p-1 h-[46.5vh] border overflow-y-auto`}
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
        <div className="grid grid-cols-2 gap-4 h-fit">
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
                  <ReactMarkdown
                    className="prose dark:prose-invert"
                    remarkPlugins={[remarkGfm]}
                  >
                    {responses.model.replace(
                      /<redacted>(.+?)<\/redacted>/g,
                      (match, content) => "█".repeat(content.length)
                    )}
                  </ReactMarkdown>
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
                  <ReactMarkdown
                    className="prose dark:prose-invert"
                    remarkPlugins={[remarkGfm]}
                  >
                    {responses.otherModel.replace(
                      /<redacted>(.+?)<\/redacted>/g,
                      (match, content) => "█".repeat(content.length)
                    )}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
