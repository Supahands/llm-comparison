import useAppStore from "@/hooks/store/useAppStore";
import {
  FloatingPanelContent,
  FloatingPanelRoot,
  FloatingPanelTrigger,
} from "../ui/floating-panel";

export default function PromptDisplay() {
  const { prompt } = useAppStore();

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
          <FloatingPanelContent>{prompt}</FloatingPanelContent>
        </FloatingPanelRoot>
      )}
    </div>
  );
}
