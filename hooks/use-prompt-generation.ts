"use client";

import { API_URL } from "@/lib/constants/urls";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import useAppStore from "./store/useAppStore";

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

export const PROMPT_GENERATION_KEY = 'prompt-generation';

export function usePromptGeneration(disabled = false) {
  const { prompt, preferredTags, isComparingModel, maxTagCount } = useAppStore();
  const queryClient = useQueryClient();
  
  // If disabled, don't even create the query
  if (disabled) {
    return {
      questions: undefined,
      isLoading: false,
      invalidatePrompts: () => {
        queryClient.invalidateQueries({ queryKey: [PROMPT_GENERATION_KEY] });
      }
    };
  }

  const { data: questions, isLoading } = useQuery({
    queryKey: [PROMPT_GENERATION_KEY, preferredTags, prompt?.question],
    queryFn: async () => {
      const hasQuestions = !!prompt?.question;
      const hasTags = preferredTags?.length > 0 || (prompt?.tags && prompt.tags.length > 0);
      
      const requestBody = {
        model: "llama-3.3-70b-instruct-fp8-fast",
        ...(hasQuestions || hasTags ? {
          input_question: {
            question: prompt?.question || "",
            tags: preferredTags?.length ? preferredTags : (prompt?.tags || [])
          },
          tag_limit: maxTagCount
        } : {})
      };

      const response = await axios.post<QuestionResponse>(
        `${API_URL}/question_generation`,
        requestBody
      );
      const content = JSON.parse(response.data.choices[0].message.content);
      return content.questions as Question[];
    },
    staleTime: 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: !isComparingModel && Array.isArray(preferredTags),
  });

  const invalidatePrompts = () => {
    queryClient.invalidateQueries({ queryKey: [PROMPT_GENERATION_KEY] });
  };

  return {
    questions,
    isLoading,
    invalidatePrompts
  };
}
