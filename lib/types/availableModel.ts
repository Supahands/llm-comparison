import { ComboBoxItem } from "@/components/ui/combo-box";

export default interface AvailableModel {
	id: number,
	provider: string,
	model_name: string,
	toComboBoxItem: () => ComboBoxItem 
}

export const createAvailableModel = (data: { id: number; provider: string; model_name: string }): AvailableModel => {
  return {
    id: data.id,
    provider: data.provider,
    model_name: data.model_name,
    toComboBoxItem() {
      return {
        value: data.id.toString(),
        label: `${data.model_name}`,
      } as ComboBoxItem;
    }
  };
};