import { ComboBoxItem } from "@/components/ui/combo-box";

export interface AppState {
  sessionId: string;
  selectedModel1: string;
  selectedModel2: string;
  prompt: string;
  responseModel1: string;
  responseModel2: string;
  isPendingModel1: boolean;
  isPendingModel2: boolean;
  isComparingModel: boolean;
  responseTime1: number;
  responseTime2: number;
  availableModels: ComboBoxItem[];

  userChoices: UserChoice[];
  selectedChoice: ComboBoxItem | undefined;
  isStopped: boolean;
  winnerSelectorId: string;

  setSessionId: (model: string) => void;
  setSelectedModel1: (model: string) => void;
  setSelectedModel2: (model: string) => void;
  setResponseTime1: (model: number) => void;
  setResponseTime2: (model: number) => void;
  setPrompt: (prompt: string) => void;
  setResponseModel1: (response: string) => void;
  setResponseModel2: (response: string) => void;
  setIsPendingModel1: (isPending: boolean) => void;
  setIsPendingModel2: (isPending: boolean) => void;
  setIsComparingModel: (isComparing: boolean) => void;
  addUserChoices: (choice: UserChoice) => void;
  setSelectedChoice: (choice: ComboBoxItem) => void;
  setAvailableModels: (models: ComboBoxItem[]) => void;
  setIsStopped: (isStopped: boolean) => void;
  setWinnerSelectorId: (id: string) => void;
  reset: () => void;
}

export type UserChoice = {
  prompt: string;
  choice: string;
};
