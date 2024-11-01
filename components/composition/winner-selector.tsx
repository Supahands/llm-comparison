"use client";

import useAppStore from "@/hooks/store/useAppStore";
import { Button } from "../ui/button";
import { ComboBoxItem } from "../ui/combo-box";
import { supabaseClient } from "@/lib/supabase/supabaseClient";
import { DATABASE_TABLE } from "@/lib/constants/databaseTables";

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
    selectedModel1,
    selectedModel2,
    responseTime1,
    responseTime2,
    prompt,
    addUserChoices,
    setIsComparingModel,
    setSelectedChoice,
    sessionId,
  } = useAppStore();

  const handleUserChoice = (choice: ComboBoxItem) => {
    addUserChoices({
      prompt: prompt,
      choice: choice.value,
    });
    setIsComparingModel(false);
  };

  const handleDataSaving = async (choice: string) => {
    const { data, error } = await supabaseClient
      .from(DATABASE_TABLE.RESPONSE_TABLE)
      .insert([
        {
          session_id: sessionId,
          selected_choice: choice,
          model_1: selectedModel1,
          model_2: selectedModel2,
          response_model_1: responseModel1,
          response_model_2: responseModel2,
          prompt: prompt,
          response_time_1: responseTime1,
          response_time_2: responseTime2,
        },
      ]);

    if (error) {
      console.log("error fetching", error);
      return;
    }

    console.log(data);
  };

  return (
    <>
      {responseModel1 && responseModel2 && (
        <div className="grid grid-cols-4 gap-2">
          {userInputs.map((input, index) => (
            <Button
              key={input.value}
              onClick={(e) => {
                e.preventDefault();
                handleUserChoice(input);
                setSelectedChoice(input);
                handleDataSaving(input.value);
              }}
              disabled={!!selectedChoice}
              className={
                !selectedChoice
                  ? "w-full rounded-xl border border-solid border-llm-neutral90 hover:bg-llm-blurple4 bg-llm-grey4 text-llm-grey1 py-3 px-5 cursor-pointer "
                  : `${
                      selectedChoice?.value === input.value
                        ? "bg-llm-primary95 text-llm-primary50 border-llm-primary50 hover:bg-llm-primary95"
                        : "bg-llm-grey2 text-white border-llm-grey2 hover:bg-llm-grey2"
                    } border border-solid w-full rounded-xl py-3 px-5 cursor-pointer `
              }
            >
              {input.label}
            </Button>
          ))}
        </div>
      )}
    </>
  );
}
