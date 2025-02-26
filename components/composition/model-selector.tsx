import useAppStore from "@/hooks/store/useAppStore";
import { ComboBox } from "../ui/combo-box";
import { useEffect, useState } from "react";
import AvailableModel, {
  createAvailableModel,
} from "@/lib/types/availableModel";
import { supabaseClient } from "@/lib/supabase/supabaseClient";
import { DATABASE_TABLE } from "@/lib/constants/databaseTables";
import { Dices, EyeClosed, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePostHog } from "posthog-js/react";
import { AdvancedOptions } from "@/components/composition/advanced-options";

export default function ModelSelector() {
  const {
    isComparingModel,
    availableModels,
    userChoices,
    selectedModel1,
    selectedModel2,
    setSelectedModel1,
    setSelectedModel2,
    setAvailableModels,
    isModel1Multimodal,
    isModel2Multimodal,
    setIsModel1Multimodal,
    setIsModel2Multimodal,
    responseOrder,
  } = useAppStore();
  const [showModelSelector, setShowModelSelector] = useState<boolean>(true);
  const posthog = usePostHog();

  const getAvailableModels = async () => {
    const { data, error } = await supabaseClient
      .from(DATABASE_TABLE.AVAILABLE_MODELS)
      .select();
    if (error) {
      console.log("error fetching", error);
      return;
    }
    const models: AvailableModel[] =
      data?.map((x) =>
        createAvailableModel({
          id: x.id,
          provider: x.provider,
          model_name: x.model_name,
          disabled: x.disabled,
          multimodal: x.multimodal,
        })
      ) || [];
    const items = models
      .filter((x) => !x.disabled)
      .map((x) => x.toComboBoxItem());
    setAvailableModels(items);
    // setSelectedModel1("qwen2.5");
    // setSelectedModel2("llama3.2");
    setSelectedModel1("gpt-4o");
    setSelectedModel2("llama3.2-vision:11b");
    setIsModel1Multimodal(true);
    setIsModel2Multimodal(true);
  };

  const randomizeModel = () => {
    if (availableModels.length === 0) return;
    const model1 =
      availableModels[Math.floor(Math.random() * availableModels.length)];
    const model2 =
      availableModels[Math.floor(Math.random() * availableModels.length)];
    setSelectedModel1(model1.label);
    setSelectedModel2(model2.label);
    posthog?.capture("llm-compare.models.randomize");
  };

  useEffect(() => {
    getAvailableModels();
  }, []);

  useEffect(() => {
    if (isComparingModel) {
      setShowModelSelector(false);
    }
  }, [isComparingModel]);

  const handleModel1Select = (model: string) => {
    posthog?.capture("llm-compare.models.select", {
      model,
    });
    setSelectedModel1(model);
  };

  const handleModel2Select = (model: string) => {
    posthog?.capture("llm-compare.models.select", {
      model,
    });
    setSelectedModel2(model);
  };

  return (
    <div className="flex flex-row items-center w-full h-full">
      <div className="flex flex-col lg:flex-row w-full">
        <div
          className={`p-4 h-full w-full  ${
            !showModelSelector ? "hidden" : "flex flex-row"
          } items-center gap-4 `}
        >
          <div className=" w-full space-y-2">
            <div className="flex flex-row gap-4 justify-center  w-full">
              <div className="flex flex-col w-1/2">
                <div>Model 1</div>
                <div className="w-full">
                  <ComboBox
                    items={availableModels}
                    onItemSelect={handleModel1Select}
                    disabled={isComparingModel || userChoices.length > 0}
                    defaultValue={selectedModel1}
                    setMultimodal={setIsModel1Multimodal}
                  />
                </div>
              </div>
              <div className="flex flex-col w-1/2">
                <div>Model 2</div>
                <div className="w-full">
                  <ComboBox
                    items={availableModels}
                    onItemSelect={handleModel2Select}
                    disabled={isComparingModel || userChoices.length > 0}
                    defaultValue={selectedModel2}
                    setMultimodal={setIsModel2Multimodal}
                  />
                </div>
              </div>
              <Button
                size={"icon"}
                disabled={isComparingModel || userChoices.length > 0}
                className="rounded-lg w-8 h-8 p-1 bg-white hover:bg-llm-primary95 self-end mb-1 block focus-visible:outline-llm-primary50"
                onClick={randomizeModel}
              >
                <Dices className=" text-llm-grey1 !w-full !h-6"></Dices>
              </Button>
            </div>
            <div>
              <AdvancedOptions
                isDisabled={isComparingModel || userChoices.length > 0}
              />
            </div>
          </div>
        </div>
        <div
          className={`p-4 h-full ${
            !showModelSelector ? "flex" : "hidden"
          } flex-row items-center justify-between gap-4`}
        >
          <div className="flex flex-col gap-2">
            <div>Models have been randomized and hidden to remove bias.</div>
            <div className="text-2xl">🤫</div>
          </div>
        </div>
      </div>
      <div
        className={`${
          isComparingModel || userChoices.length > 0 ? "" : "hidden"
        }`}
      >
        <button
          className={`p-2`}
          onClick={() => {
            setShowModelSelector(!showModelSelector);
          }}
        >
          {showModelSelector ? <EyeClosed /> : <EyeOff />}
        </button>
      </div>
    </div>
  );
}
