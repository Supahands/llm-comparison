"use client";

import { ScrollArea } from "../ui/scroll-area";
import ReactMarkdown from "react-markdown";
import { Skeleton } from "../ui/skeleton";
import useAppStore from "@/hooks/store/useAppStore";
import { useIsMutating } from "@tanstack/react-query";
import { useMemo } from "react";
import remarkGfm from "remark-gfm";
import Lottie from "react-lottie";
import * as animationData from "../../public/animation/loading";

export default function ModelResponses() {
  const { responseModel1, responseModel2 } = useAppStore();

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
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <div>
      <ScrollArea
        className={`flex-grow p-4 overflow-y-auto`}
        style={{ maxHeight: calculateMaxHeight() }}
      >
        {(isPendingModel1 || isPendingModel2) && (
          <div>
            <Lottie options={defaultOptions} height={300} width={300}></Lottie>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="model-a-response">
            {!isPendingModel1 && !isPendingModel2 && responseModel1 && (
              <>
                <div className="w-fit bg-llm-neutral95 text-black p-1 my-2">
                  Model A
                </div>
                <div className="p-2 rounded-lg bg-llm-grey4 border border-solid border-llm-neutral90 text-llm-response">
                  <ReactMarkdown
                    className="prose dark:prose-invert"
                    remarkPlugins={[remarkGfm]}
                  >
                    {responseModel1}
                  </ReactMarkdown>
                </div>
              </>
            )}
          </div>
          <div className="model-b-response">
            {!isPendingModel1 && !isPendingModel2 && responseModel2 && (
              <>
                <div className="w-fit bg-llm-neutral95 text-black p-1 my-2">
                  Model B
                </div>
                <div className="p-2 rounded-lg bg-llm-grey4 text-llm-response border border-solid border-llm-neutral90">
                  <ReactMarkdown
                    className="prose dark:prose-invert"
                    remarkPlugins={[remarkGfm]}
                  >
                    {responseModel2}
                  </ReactMarkdown>
                </div>
              </>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
