"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import useAppStore from "@/hooks/store/useAppStore";
import { usePostHog } from "posthog-js/react";
import { Button } from "../ui/button";
import { ComboBoxItem } from "../ui/combo-box";
import PromptSelector from "./prompt-selector";

const prompts = [
  "What are the most popular car brands in Japan?",
  "Gather the top insights on the Southeast Asian vehicle market",
  "Give me the latest updates on the US Presidential elections",
  "Compare the education system in the UK vs the USA",
];


const userInputs: ComboBoxItem[] = [
  {
    label: "A wins",
    value: "A",
    multimodal: false,
  },
  {
    label: "B wins",
    value: "B",
    multimodal: false,
  },
  {
    label: "Both are good",
    value: "AB",
    multimodal: false,
  },
  {
    label: "Both are bad",
    value: "!AB",
    multimodal: false,
  },
];

export default function WinnerSelector() {
  const {
    selectedChoice,
    responseModel1,
    responseModel2,
    prompt,
    roundCounter,
    isSingleModelMode,
    setRoundCounter,
    hasRoundEnded,
    setIsStopped,
    addUserChoices,
    setIsComparingModel,
    setSelectedChoice,
    setRoundEnd,
    explainChoice,
    idealResponse,
    setExplainChoice,
    setIdealResponse,
    showExplanationFields,
    setShowExplanationFields,
  } = useAppStore();

  const posthog = usePostHog();

  const handleUserChoice = (choice: ComboBoxItem) => {
    if (prompt?.question) {
      addUserChoices({
        prompt: prompt.question,
        choice: choice.value,
      });
    }
    setIsComparingModel(false);
  };

  const handleRoundEnd = (input: ComboBoxItem) => {
    posthog?.capture("llm-compare.models.winner", {
      choice: input.value,
    });
    handleUserChoice(input);
    setSelectedChoice(input);
    setIsStopped(false);
    setRoundCounter(roundCounter + 1);
    if (hasRoundEnded) return;
    else {
      setRoundEnd(true);
    }
  };

  return (
    <>
      {responseModel1 && responseModel2 && (
        <div className="w-full space-y-2 -mt-5 py-2">
          <div className="flex justify-center w-full">
            <div className="grid grid-cols-4 gap-2">
              {userInputs.map((input, index) => (
                <Button
                  key={input.value}
                  onClick={(e) => {
                    e.preventDefault();
                    handleRoundEnd(input);
                  }}
                  className={
                    !selectedChoice
                      ? "w-full rounded-lg border border-solid border-llm-primary95 hover:bg-llm-primary50 hover:text-white text-llm-primary50 bg-llm-primary95 py-3 px-5 cursor-pointer "
                      : `${selectedChoice?.value === input.value
                        ? "bg-llm-primary95 text-llm-primary50 border-llm-primary50 hover:bg-llm-primary95"
                        : "bg-llm-neutral90 text-white border-llm-neutral90 hover:bg-llm-grey2"
                      } border border-solid w-full rounded-lg py-3 px-5 cursor-pointer !focus-visible:ring-llm-primary50 `
                  }
                  id={`winner-${input.value}`}
                >
                  {input.label}
                </Button>
              ))}
            </div>
          </div>

          {(roundCounter === 1 || showExplanationFields) && (
            <div className="flex items-center justify-end gap-2 text-sm text-gray-600 mb-2">
              <label htmlFor="explanation-toggle">
                {roundCounter === 1 ? "Show explanations for future rounds?" : "Show explanations"}
              </label>
              <Switch
                id="explanation-toggle"
                checked={showExplanationFields}
                onCheckedChange={setShowExplanationFields}
              />
            </div>
          )}

          {(roundCounter === 1 || showExplanationFields) && (
            <>
              <div className="text-sm space-y-1">
                <p>Explain your choice:</p>
                <Textarea
                  placeholder="Type your message here."
                  value={explainChoice}
                  onChange={(e) => {
                    setExplainChoice(e.target.value);
                  }}
                  className="rounded-xl bg-transparent resize-none focus-visible:ring-llm-primary50"
                  id="message-2"
                />
              </div>
              <div className="text-sm space-y-1">
                <p>Ideal response (optional):</p>
                <Textarea
                  placeholder="Type your message here."
                  className="rounded-xl bg-transparent resize-none focus-visible:ring-llm-primary50"
                  id="message-2"
                  value={idealResponse}
                  onChange={(e) => {
                    setIdealResponse(e.target.value);
                  }}
                />
              </div>
            </>
          )}

          {hasRoundEnded && (
            <div className="w-full text-center ">
              Round {roundCounter} complete. Ask another question! 👇
              <PromptSelector prompts={prompts} disablePromptGeneration={!hasRoundEnded} />
            </div>
          )}
        </div>
      )}
    </>
  );
}
