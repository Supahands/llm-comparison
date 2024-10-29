import useAppStore from "@/hooks/store/useAppStore";
import { ComboBox, ComboBoxItem } from "../ui/combo-box";
import { useEffect, useState } from "react";
import AvailableModel, {
  createAvailableModel,
} from "@/lib/types/availableModel";
import { supabaseClient } from "@/lib/supabase/supabaseClient";
import { DATABASE_TABLE } from "@/lib/constants/databaseTables";
import { Dice2, Dices, EyeClosed, EyeOff, ShuffleIcon } from "lucide-react";
import { Button } from "../ui/button";

export default function ModelSelector() {
  const {
    availableModels,
    isComparingModel,
    userChoices,
    setSelectedModel1,
    setSelectedModel2,
    setAvailableModels,
  } = useAppStore();
  const [showModelSelector, setShowModelSelector] = useState<boolean>(true);
  const [defaultValue1, setDefaultValue1] = useState<string>("llama3.2")
  const [defaultValue2, setDefaultValue2] = useState<string>("qwen2.5")

  const getAvailableModels = async () => {
    const { data, error } = await supabaseClient
      .from(DATABASE_TABLE.AVAILABLE_MODELS)
      .select();
    if (error) {
      console.log("error fetching", error);
      return;
    }
    const availableModels: AvailableModel[] =
      data?.map((x) =>
        createAvailableModel({
          id: x.id,
          provider: x.provider,
          model_name: x.model_name,
        })
      ) || [];
    const items = availableModels.map((x) => x.toComboBoxItem());
    setAvailableModels(items);
  };

  useEffect(() => {
    getAvailableModels();
  }, []);

  useEffect(() => {
    if (isComparingModel) {
      setShowModelSelector(false);
    }
  }, [isComparingModel]);

  const randomizeModel = () => {
    const randomModel1 = availableModels[Math.floor(Math.random() * availableModels.length)];
    const randomModel2 = availableModels[Math.floor(Math.random() * availableModels.length)];
    const value1 = randomModel1.label;
    const value2 = randomModel2.label;
    setSelectedModel1(value1);
    setSelectedModel2(value2);
    setDefaultValue1(value1)
    setDefaultValue2(value2)
  };

  return (
    <div className="flex flex-row justify-between items-center">
      {/* for selector */}
      <div
        className={`p-4 h-full ${
          !showModelSelector ? "hidden" : "flex"
        } items-center gap-4`}
      >
        <div>
          <div>Model 1</div>
          <ComboBox
            items={availableModels}
            onItemSelect={setSelectedModel1}
            disabled={isComparingModel || userChoices.length > 0}
            defaultValue={defaultValue1}
          />
        </div>
        <div>
          <div>Model 2</div>
          <ComboBox
            items={availableModels}
            onItemSelect={setSelectedModel2}
            disabled={isComparingModel || userChoices.length > 0}
            defaultValue={defaultValue2}
          />
        </div>
        <Dice2 onClick={randomizeModel} className="w-9 h-9 text-llm-grey1 self-end cursor-pointer mb-1 hover:bg-llm-primary95 p-2 rounded-lg"></Dice2>
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

      {/* for button */}
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
