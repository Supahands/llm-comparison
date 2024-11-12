import useAppStore from "@/hooks/store/useAppStore";
import { ComboBox, ComboBoxItem } from "../ui/combo-box";
import { useEffect, useState } from "react";
import AvailableModel, {
  createAvailableModel,
} from "@/lib/types/availableModel";
import { supabaseClient } from "@/lib/supabase/supabaseClient";
import { DATABASE_TABLE } from "@/lib/constants/databaseTables";
import { Dices, EyeClosed, EyeOff } from "lucide-react";
import { Button } from "../ui/button";

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
  } = useAppStore();
  const [showModelSelector, setShowModelSelector] = useState<boolean>(true);

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
        })
      ) || [];
    const items = models
      .filter((x) => !x.disabled)
      .map((x) => x.toComboBoxItem());
    setAvailableModels(items);
    setSelectedModel1("qwen2.5");
    setSelectedModel2("llama3.2");
  };

  const randomizeModel = () => {
    if (availableModels.length === 0) return;
    const model1 =
      availableModels[Math.floor(Math.random() * availableModels.length)];
    const model2 =
      availableModels[Math.floor(Math.random() * availableModels.length)];
    setSelectedModel1(model1.label);
    setSelectedModel2(model2.label);
  };

  useEffect(() => {
    getAvailableModels();
  }, []);

  useEffect(() => {
    if (isComparingModel) {
      setShowModelSelector(false);
    }
  }, [isComparingModel]);

  return (
    <div className="flex flex-row items-center w-full h-full">
      <div className="flex flex-col lg:flex-row w-full">
        <div
          className={`p-4 h-full w-full  ${
            !showModelSelector ? "hidden" : "flex flex-row"
          } items-center gap-4`}
        >
          <div className="flex flex-row gap-4 justify-center w-full">
            <div className="flex flex-col w-1/2">
              <div>Model 1</div>
              <div className="w-full">
                <ComboBox
                  items={availableModels}
                  onItemSelect={setSelectedModel1}
                  disabled={isComparingModel || userChoices.length > 0}
                  defaultValue={selectedModel1}
                />
              </div>
            </div>
            <div className="flex flex-col w-1/2">
              <div>Model 2</div>
              <div className="w-full">
                <ComboBox
                  items={availableModels}
                  onItemSelect={setSelectedModel2}
                  disabled={isComparingModel || userChoices.length > 0}
                  defaultValue={selectedModel2}
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
          onClick={() => setShowModelSelector(!showModelSelector)}
        >
          {showModelSelector ? <EyeClosed /> : <EyeOff />}
        </button>
      </div>
    </div>
  );
}
