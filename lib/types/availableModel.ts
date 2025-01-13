import { ComboBoxItem } from "@/components/ui/combo-box";

export default interface AvailableModel {
  id: number;
  provider: string;
  model_name: string;
  disabled: boolean;
  multimodal: boolean;
  toComboBoxItem: () => ComboBoxItem;
}

export const createAvailableModel = (data: {
  id: number;
  provider: string;
  model_name: string;
  disabled: boolean;
  multimodal: boolean;
}): AvailableModel => {
  return {
    id: data.id,
    provider: data.provider,
    model_name: data.model_name,
    disabled: data.disabled,
    multimodal: data.multimodal,
    toComboBoxItem() {
      return {
        value: data.id.toString(),
        label: `${data.model_name}`,
        multimodal: data.multimodal,
      } as ComboBoxItem;
    },
  };
};
