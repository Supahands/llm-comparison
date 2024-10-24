"use client";

interface PromptSelectorProps {
  prompts: string[];
}

export default function PromptSelector({ prompts }: PromptSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {prompts.map((prompt) => (
        <div
          key={prompt}
          className="w-full rounded-xl border border-solid border-llm-neutral90 bg-llm-grey4 text-llm-grey1 py-3 px-5 cursor-pointer"
        >
          {prompt}
        </div>
      ))}
    </div>
  );
}
