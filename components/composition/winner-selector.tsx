"use client";

import useAppStore from "@/hooks/store/useAppStore";
import { Button } from "../ui/button";
import { ComboBoxItem } from "../ui/combo-box";
import { usePostHog } from "posthog-js/react";

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
    hasRoundEnded,
    setIsStopped,
    addUserChoices,
    setIsComparingModel,
    setSelectedChoice,
    setRoundEnd,
  } = useAppStore();

  const posthog = usePostHog();

  const handleUserChoice = (choice: ComboBoxItem) => {
    addUserChoices({
      prompt: prompt,
      choice: choice.value,
    });
    setIsComparingModel(false);
  };

  const handleRoundEnd = (input: ComboBoxItem) => {
    posthog?.capture("llm-compare.models.winner", {
      choice: input.value,
    });
    handleUserChoice(input);
    setSelectedChoice(input);
    setIsStopped(false);
    if (hasRoundEnded) return;
    else {
      setRoundEnd(true);
    }
  };

  return (
    <>
      {responseModel1 && responseModel2 && (
        <div className="w-full lg:bg-llm-grey4 -mt-2 py-2">
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
                      ? "w-full rounded-xl border border-solid border-llm-primary95 hover:bg-llm-primary50 hover:text-white text-llm-primary50 bg-llm-primary95 py-3 px-5 cursor-pointer "
                      : `${
                          selectedChoice?.value === input.value
                            ? "bg-llm-primary95 text-llm-primary50 border-llm-primary50 hover:bg-llm-primary95"
                            : "bg-llm-neutral90 text-white border-llm-neutral90 hover:bg-llm-grey2"
                        } border border-solid w-full rounded-xl py-3 px-5 cursor-pointer !focus-visible:ring-llm-primary50 `
                  }
                >
                  {input.label}
                </Button>
              ))}
            </div>
          </div>
          {hasRoundEnded && (
            <div className="w-full text-center mt-2">
              Round {roundCounter} complete. Ask another question! 👇
            </div>
          )}
        </div>
      )}
    </>
  );
}
