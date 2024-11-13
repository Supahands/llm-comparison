"use client";

import useAppStore from "@/hooks/store/useAppStore";
import { Button } from "../ui/button";
import { ComboBoxItem } from "../ui/combo-box";

const userInputs: ComboBoxItem[] = [
  {
    label: "A wins",
    value: "A",
  },
  {
    label: "B wins",
    value: "B",
  },
  {
    label: "Both are good",
    value: "AB",
  },
  {
    label: "Both are bad",
    value: "!AB",
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

  const handleUserChoice = (choice: ComboBoxItem) => {
    addUserChoices({
      prompt: prompt,
      choice: choice.value,
    });
    setIsComparingModel(false);
  };

  const handleRoundEnd = (input: ComboBoxItem) => {
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
        <div className="w-full lg:bg-llm-grey4 py-2">
          <div className="flex justify-center w-full">
            <div className="grid grid-cols-4 gap-2 mb-2">
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
            <div className="w-full text-center">
              Round {roundCounter} complete. Ask another question! 👇
            </div>
          )}
        </div>
      )}
    </>
  );
}
