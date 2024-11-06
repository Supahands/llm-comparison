"use client";

import useAppStore from "@/hooks/store/useAppStore";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
interface PromptSelectorProps {
  prompts: string[];
}

export default function PromptSelector({ prompts }: PromptSelectorProps) {
  const { isComparingModel, responseModel1, responseModel2, setPrompt } = useAppStore();

  return (
    <>
      {!isComparingModel && !(responseModel1 && responseModel2) && (
        <div className="grid grid-cols-2 gap-2">
          {prompts.map((prompt, index) => (
            <motion.div
              key={prompt}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  setPrompt(prompt);
                }}
                className="w-full rounded-xl border border-solid border-llm-neutral90 hover:bg-llm-blurple4 bg-llm-grey4 text-llm-grey1 py-3 px-5 cursor-pointer focus-visible:outline-llm-primary50"
              >
                {prompt}
              </Button>
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
}
