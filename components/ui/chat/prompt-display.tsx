import useAppStore from "@/hooks/store/useAppStore";
import {
  FloatingPanelContent,
  FloatingPanelRoot,
  FloatingPanelTrigger,
} from "../floating-panel";

export default function PromptDisplay() {
  const { prompt } = useAppStore();

  return (
    <div className="px-4 mt-2 mb-2">
      <FloatingPanelRoot className="w-full">
        <FloatingPanelTrigger title="Prompt">
          {prompt && (
            <div className="bg-llm-grey4 p-1 mx-auto w-full text-center border border-solid border-llm-neutral90 rounded-xl text-llm-grey1 h-fit whitespace-pre-wrap line-clamp-1">
              {prompt}
            </div>
          )}
        </FloatingPanelTrigger>
        <FloatingPanelContent>
          {prompt}
        </FloatingPanelContent>
      </FloatingPanelRoot>
    </div>
  );
}
