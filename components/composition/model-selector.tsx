import useAppStore from "@/hooks/store/useAppStore";
import { ComboBox, ComboBoxItem } from "../ui/combo-box";
import { useEffect, useState } from "react";
import AvailableModel, {
  createAvailableModel,
} from "@/lib/types/availableModel";
import { supabaseClient } from "@/lib/supabase/supabaseClient";

export default function ModelSelector() {
  const [availableModels, setAvailableModels] = useState<ComboBoxItem[]>([]);
  const { setSelectedModel1, setSelectedModel2 } = useAppStore();

  const getAvailableModels = async () => {
    const { data, error } = await supabaseClient
      .from("available_models")
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

  return (
    <div className="p-4 h-full flex items-center gap-4">
      <div>
        <div>Model 1</div>
        <ComboBox
          items={availableModels}
          onItemSelect={setSelectedModel1}
        ></ComboBox>
      </div>
      <div>
        <div>Model 2</div>
        <ComboBox
          items={availableModels}
          onItemSelect={setSelectedModel2}
        ></ComboBox>
      </div>
    </div>
  );
}
