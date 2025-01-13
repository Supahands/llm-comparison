import useAppStore from "@/hooks/store/useAppStore";
import {
  FloatingPanelContent,
  FloatingPanelRoot,
  FloatingPanelTrigger,
} from "../ui/floating-panel";

import { motion } from "framer-motion";

export default function PromptDisplay() {
  const { prompt, images } = useAppStore();

  return (
    <div className="lg:px-4 px-1 mt-2 mb-2">
      {prompt && (
        <FloatingPanelRoot className="w-full">
          <FloatingPanelTrigger
            title="Prompt"
            className="focus-visible:outline-llm-primary50"
          >
            <div className="bg-llm-grey4 p-1 mx-auto w-full text-center border border-solid border-llm-neutral90 rounded-xl text-llm-grey1 h-fit whitespace-pre-wrap line-clamp-1 focus-visible:outline-llm-primary50">
              {prompt}
            </div>
          </FloatingPanelTrigger>
          <FloatingPanelContent>
            <div>
              <div>
                {images.length > 0 && (
                  <motion.div
                    layout
                    initial={{ opacity: 0, x: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                      mass: 1,
                    }}
                    className="w-full flex flex-nowrap gap-4 py-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
                    style={{
                      minHeight: "96px",
                      scrollbarWidth: "thin",
                    }}
                  >
                    {images.map((file, index) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{
                          opacity: 0,
                          x: -50,
                          transition: {
                            type: "spring",
                            stiffness: 300,
                            damping: 25,
                            mass: 1,
                          },
                        }}
                        key={index}
                        className="relative flex-shrink-0"
                      >
                        <div className="w-20 h-20 relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Selected ${index + 1}`}
                            className="w-20 h-20 object-cover rounded-xl"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
              <div>{prompt}</div>
            </div>
          </FloatingPanelContent>
        </FloatingPanelRoot>
      )}
    </div>
  );
}
