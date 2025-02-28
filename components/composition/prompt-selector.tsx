"use client";

import TagPill from "@/components/ui/tag-pill";
import useAppStore from "@/hooks/store/useAppStore";
import { usePromptGeneration } from "@/hooks/use-prompt-generation";
import { API_URL } from "@/lib/constants/urls";
import * as animationData from "@/public/animation/question_loading";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { usePostHog } from "posthog-js/react";
import { useEffect, useState } from "react";
import Lottie from "react-lottie";
import { Button } from "../ui/button";
import TagSelector from "./tag-selector";

interface Question {
  question: string;
  tags: string[];
}

interface QuestionResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface PromptSelectorProps {
  prompts: string[]; // Fallback prompts
  disablePromptGeneration?: boolean;
}

interface SelectedPrompt {
  question: string;
  tags?: string[];
}

export default function PromptSelector({
  prompts,
  disablePromptGeneration = false,
}: PromptSelectorProps) {
  const {
    isComparingModel,
    responseModel1,
    responseModel2,
    setPrompt,
    prompt,
    hasRoundEnded,
    preferredTags,
    setPreferredTags,
    useAIGeneratedPrompt,
  } = useAppStore();
  const posthog = usePostHog();
  const [hasAnimated, setHasAnimated] = useState(false);
  const [error, setError] = useState(false);

  const { questions, isLoading } = usePromptGeneration(disablePromptGeneration);

  const displayPrompts = error
    ? prompts.map((p) => ({ question: p, tags: [] }))
    : questions?.map((q) => ({
        question: q.question,
        tags: q.tags,
      })) ?? prompts.map((p) => ({ question: p, tags: [] }));

  useEffect(() => {
    setHasAnimated(true);
  }, []);

  const handlePromptSelection = (promptItem: {
    question: string;
    tags: string[];
  }) => {
    // Create promptData object
    const promptData = {
      question: promptItem.question,
      tags: promptItem.tags || [],
    };

    // Update preferredTags with new unique tags
    const newTags = promptItem.tags.filter(
      (tag) => !preferredTags.includes(tag) && preferredTags.length < 5
    );
    if (newTags.length > 0) {
      setPreferredTags([...preferredTags, ...newTags].slice(0, 5));
    }

    // Capture analytics and set prompt
    posthog?.capture("llm-compare.prompts.new", promptData);
    setPrompt(promptData);
  };

  // Add Lottie options
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <>
      {(!isComparingModel &&
        !(responseModel1 && responseModel2) &&
        useAIGeneratedPrompt) ||
      (hasRoundEnded && useAIGeneratedPrompt) ? (
        <motion.div
          layout={true}
          initial={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col items-center w-full gap-4"
        >
          <TagSelector />
          {isLoading ? (
            <div className="w-full flex justify-center items-center">
              <Lottie
                style={{ pointerEvents: "none" }}
                options={defaultOptions}
                height={200}
                width={200}
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 w-full max-w-[900px]">
              {displayPrompts.map((promptItem, index) => (
                <motion.div
                  layout={false}
                  key={promptItem.question}
                  initial={{ opacity: 0, y: 30 }}
                  animate={
                    hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                  }
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="h-full w-full" // Fixed height container
                >
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      handlePromptSelection(promptItem);
                    }}
                    role="prompt-selector"
                    className="w-full h-full overflow-hidden rounded-xl border border-solid border-llm-neutral90 hover:bg-llm-blurple4 bg-llm-grey4 text-llm-grey1 py-3 px-5 cursor-pointer focus-visible:outline-llm-primary50 flex flex-col pb-1"
                  >
                    <span className="text-pretty">{promptItem.question}</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {promptItem.tags.map((tag) => (
                        <TagPill key={tag} tag={tag} size="sm" />
                      ))}
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div
          layout={true}
          initial={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col items-center w-full gap-4"
        >
          <div className="grid grid-cols-2 gap-4 w-full max-w-[900px]">
            {displayPrompts.map((promptItem, index) => (
              <motion.div
                layout={false}
                key={promptItem.question}
                initial={{ opacity: 0, y: 30 }}
                animate={
                  hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                }
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="h-full w-full" // Fixed height container
              >
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    handlePromptSelection(promptItem);
                  }}
                  role="prompt-selector"
                  className="w-full h-full overflow-hidden rounded-xl border border-solid border-llm-neutral90 hover:bg-llm-blurple4 bg-llm-grey4 text-llm-grey1 py-3 px-5 cursor-pointer focus-visible:outline-llm-primary50 flex flex-col pb-1"
                >
                  <span className="text-pretty">{promptItem.question}</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {promptItem.tags.map((tag) => (
                      <TagPill key={tag} tag={tag} size="sm" />
                    ))}
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </>
  );
}
