"use client";

import useAppStore from "@/hooks/store/useAppStore";
import { Button } from "../ui/button";

interface PromptSelectorProps {
  prompts: string[];
}

export default function PromptSelector({ prompts }: PromptSelectorProps) {
  const { setPrompt } = useAppStore();

  return (
    <div className="grid grid-cols-2 gap-2">
      {prompts.map((prompt) => (
        <Button
          onClick={(e) => {
            e.preventDefault();
            setPrompt(prompt);
          }}
          key={prompt}
          className="w-full rounded-xl border border-solid border-llm-neutral90 hover:bg-llm-blurple4 bg-llm-grey4 text-llm-grey1 py-3 px-5 cursor-pointer"
        >
          {prompt}
        </Button>
      ))}
    </div>
  );
}
