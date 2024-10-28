import useAppStore from "@/hooks/store/useAppStore";
import { ComboBox, ComboBoxItem } from "../ui/combo-box";
import { useEffect, useState } from "react";
import AvailableModel, {
  createAvailableModel,
} from "@/lib/types/availableModel";
import { supabaseClient } from "@/lib/supabase/supabaseClient";
import { DATABASE_TABLE } from "@/lib/constants/databaseTables";
import { EyeClosed, EyeOff } from "lucide-react";

export default function ModelSelector() {
  const [availableModels, setAvailableModels] = useState<ComboBoxItem[]>([]);
  const {
    isComparingModel,
    userChoices,
    setSelectedModel1,
    setSelectedModel2,
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
          />
        </div>
        <div>
          <div>Model 2</div>
          <ComboBox
            items={availableModels}
            onItemSelect={setSelectedModel2}
            disabled={isComparingModel || userChoices.length > 0}
          />
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
