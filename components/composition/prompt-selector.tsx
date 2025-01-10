"use client";

import useAppStore from "@/hooks/store/useAppStore";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { usePostHog } from "posthog-js/react";
import { useEffect, useState } from "react";
interface PromptSelectorProps {
  prompts: string[];
}

export default function PromptSelector({ prompts }: PromptSelectorProps) {
  const { isComparingModel, responseModel1, responseModel2, setPrompt } =
    useAppStore();
  const posthog = usePostHog();

  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    // Set the flag to true once the component has mounted, ensuring animation runs once
    setHasAnimated(true);
  }, []);

  return (
    <>
      {!isComparingModel && !(responseModel1 && responseModel2) && (
        <motion.div
          layout={true}
          initial={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="flex justify-center"
        >
          <div className="grid-cols-2 gap-2 hidden lg:grid w-[900px] min:w-fit justify-center">
            {prompts.map((prompt, index) => (
              <motion.div
                layout={false}
                key={prompt}
                initial={{ opacity: 0, y: 30 }}
                animate={
                  hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                }
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    posthog?.capture("llm-compare.prompts.new", { prompt });
                    setPrompt(prompt);
                  }}
                  className="w-full overflow-hidden rounded-xl border border-solid border-llm-neutral90 hover:bg-llm-blurple4 bg-llm-grey4 text-llm-grey1 py-3 px-5 cursor-pointer focus-visible:outline-llm-primary50"
                >
                  {prompt}
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </>
  );
}
