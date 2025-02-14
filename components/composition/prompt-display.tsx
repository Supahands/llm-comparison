import TagPill from "@/components/ui/tag-pill";
import useAppStore from "@/hooks/store/useAppStore";
import { motion } from "framer-motion";
import {
  FloatingPanelContent,
  FloatingPanelRoot,
  FloatingPanelTrigger,
} from "../ui/floating-panel";

const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).substr(-2);
  }
  return color;
};

const getContrastColor = (hexcolor: string) => {
  const r = parseInt(hexcolor.slice(1, 3), 16);
  const g = parseInt(hexcolor.slice(3, 5), 16);
  const b = parseInt(hexcolor.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
};

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
              <div>{prompt.question}</div>
              {prompt.tags && prompt.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 justify-center mt-1">
                  {prompt.tags.map((tag) => (
                    <TagPill key={tag} tag={tag} size="sm" />
                  ))}
                </div>
              )}
            </div>
          </FloatingPanelTrigger>
          <FloatingPanelContent>
            <div>
              {images.length > 0 && (
                <div>
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
                </div>
              )}
              <div>{prompt.question}</div>
              {prompt.tags && prompt.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {prompt.tags.map((tag) => (
                    <TagPill key={tag} tag={tag} />
                  ))}
                </div>
              )}
            </div>
          </FloatingPanelContent>
        </FloatingPanelRoot>
      )}
    </div>
  );
}
