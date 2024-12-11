import { ComboBoxItem } from "@/components/ui/combo-box";

type ModelOrder = {
  model: any
  otherModel: any,
  order: string
}

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
  promptToken: number;
  completionToken1: number;
  completionToken2: number;
  roundCounter: number;
  hasRoundEnded: boolean;
  isRetryOverlay: boolean;

  userChoices: UserChoice[];
  selectedChoice: ComboBoxItem | undefined;
  isStopped: boolean;
  responseOrder: ModelOrder | undefined;

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
  setPromptToken: (promptToken: number) => void;
  setCompletionToken1: (completionToken: number) => void;
  setCompletionToken2: (completionToken: number) => void;
  setIsStopped: (isStopped: boolean) => void;
  setRoundEnd: (end: boolean) => void;
  incrementRoundCounter: () => void;
  setIsRetryOverlay: (isOverlay: boolean) => void;
  setModelOrder: (order: ModelOrder) => void;
  reset: () => void;
}

export type UserChoice = {
  prompt: string;
  choice: string;
};
