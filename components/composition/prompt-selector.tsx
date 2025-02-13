"use client";

import TagPill from "@/components/ui/tag-pill";
import useAppStore from "@/hooks/store/useAppStore";
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
}

interface SelectedPrompt {
  question: string;
  tags?: string[];
}

const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).substr(-2);
  }
  return color;
};

const getContrastColor = (hexcolor: string) => {
  // Convert hex to RGB
  const r = parseInt(hexcolor.slice(1, 3), 16);
  const g = parseInt(hexcolor.slice(3, 5), 16);
  const b = parseInt(hexcolor.slice(5, 7), 16);

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return black or white based on luminance
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
};

export default function PromptSelector({ prompts }: PromptSelectorProps) {
  const {
    isComparingModel,
    responseModel1,
    responseModel2,
    setPrompt,
    prompt,
    hasRoundEnded,
    preferredTags,
    setPreferredTags,
  } = useAppStore();
  const posthog = usePostHog();
  const [hasAnimated, setHasAnimated] = useState(false);
  const [error, setError] = useState(false);

  // Add Lottie options
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const { data: questions, isLoading } = useQuery({
    queryKey: ['questions', 'llama3.3', preferredTags, prompt?.question],
    queryFn: async () => {
      const response = await axios.post<QuestionResponse>(
        `${API_URL}/question_generation`,
        {
          model: "llama3.3",
          input_question: {
            question: prompt?.question || "",
            tags: preferredTags?.length ? preferredTags : (prompt?.tags || [])
          }
        }
      );
      const content = JSON.parse(response.data.choices[0].message.content);
      return content.questions as Question[];
    },
    staleTime: 1000, // Add stale time to prevent rapid refetches
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: !isComparingModel && Array.isArray(preferredTags),
  });

  console.log("🚀 ~ PromptSelector ~ error:", error);
  console.log("🚀 ~ :questions?.map ~ questions:", questions);
  const displayPrompts = error
    ? prompts.map((p) => ({ question: p, tags: [] }))
    : questions?.map((q) => ({
        question: q.question,
        tags: q.tags,
      })) ?? prompts.map((p) => ({ question: p, tags: [] }));

  useEffect(() => {
    setHasAnimated(true);
  }, []);

  const handlePromptSelection = (promptItem: { question: string; tags: string[] }) => {
    // Create promptData object
    const promptData = {
      question: promptItem.question,
      tags: promptItem.tags || [],
    };

    // Update preferredTags with new unique tags
    const newTags = promptItem.tags.filter(
      tag => !preferredTags.includes(tag) && preferredTags.length < 5
    );
    if (newTags.length > 0) {
      setPreferredTags([...preferredTags, ...newTags].slice(0, 5));
    }

    // Capture analytics and set prompt
    posthog?.capture("llm-compare.prompts.new", promptData);
    setPrompt(promptData);
  };

  return (
    <>
      {(!isComparingModel && !(responseModel1 && responseModel2)) ||
      hasRoundEnded ? (
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
      ) : null}
    </>
  );
}
