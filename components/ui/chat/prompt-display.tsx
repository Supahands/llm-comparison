import useAppStore from "@/hooks/store/useAppStore";

export default function PromptDisplay() {

	const { prompt } = useAppStore();

  return (
    <div className="px-4 mt-2">
      {prompt && (
        <div className="bg-llm-grey4 p-1 mx-auto w-full text-center border border-solid border-llm-neutral90 rounded-xl text-llm-grey1 h-fit">
          {prompt}
        </div>
      )}
    </div>
  );
}
