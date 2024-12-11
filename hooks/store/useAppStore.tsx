import { ComboBoxItem } from "@/components/ui/combo-box";
import { AppState } from "@/lib/types/app-state";
import { create } from "zustand";

const useAppStore = create<AppState>((set) => ({
  sessionId: "",
  selectedModel1: "",
  selectedModel2: "",
  prompt: "",
  responseModel1: "",
  responseModel2: "",
  isPendingModel1: false,
  isPendingModel2: false,
  isComparingModel: false,
  userChoices: [],
  selectedChoice: undefined,
  responseTime1: 0,
  responseTime2: 0,
  availableModels: [],
  promptToken: 0,
  completionToken1: 0,
  completionToken2: 0,
  isStopped: true,
  roundCounter: 1,
  hasRoundEnded: false,
  isRetryOverlay: false,
  responseOrder: undefined,

  setSessionId: (sessionId: string) =>
    set((_state: AppState) => ({ sessionId: sessionId })),
  setPromptToken: (promptToken: number) =>
    set((_state: AppState) => ({ promptToken: promptToken })),
  setCompletionToken1: (completionToken1: number) =>
    set((_state: AppState) => ({ completionToken1: completionToken1 })),
  setCompletionToken2: (completionToken2: number) =>
    set((_state: AppState) => ({ completionToken2: completionToken2 })),
  setResponseTime1: (response_time: number) =>
    set((_state: AppState) => ({ responseTime1: response_time })),
  setResponseTime2: (response_time: number) =>
    set((_state: AppState) => ({ responseTime2: response_time })),
  setSelectedModel1: (model: string) =>
    set((_state: AppState) => ({ selectedModel1: model })),
  setSelectedModel2: (model: string) =>
    set((_state: AppState) => ({ selectedModel2: model })),
  setPrompt: (prompt: string) => set((_state: AppState) => ({ prompt })),
  setResponseModel1: (response: string) =>
    set((_state: AppState) => ({ responseModel1: response })),
  setResponseModel2: (response: string) =>
    set((_state: AppState) => ({ responseModel2: response })),
  setIsPendingModel1: (isPending: boolean) =>
    set((_state: AppState) => ({ isPendingModel1: isPending })),
  setIsPendingModel2: (isPending: boolean) =>
    set((_state: AppState) => ({ isPendingModel2: isPending })),
  setIsComparingModel: (isComparing: boolean) =>
    set((_state: AppState) => ({ isComparingModel: isComparing })),
  setAvailableModels: (models: ComboBoxItem[]) =>
    set((_state: AppState) => ({ availableModels: models })),
  setIsStopped: (isStopped: boolean) =>
    set((_state: AppState) => ({ isStopped })),
  incrementRoundCounter: () =>
    set((state: AppState) => ({ roundCounter: state.roundCounter + 1 })),
  setRoundEnd: (end) => set((_state: AppState) => ({ hasRoundEnded: end })),
  setIsRetryOverlay: (isOverlay) => set((_state: AppState) => ({ isRetryOverlay: isOverlay })),
  setModelOrder: (order) => set((_state: AppState) => ({responseOrder: order})),
  reset: () =>
    set((state: AppState) => ({
      responseModel1: "",
      responseModel2: "",
      responseOrder: undefined,
      isPendingModel1: false,
      isPendingModel2: false,
      selectedChoice: undefined,
      isComparingModel: false,
      hasRoundEnded: false,
      isRetryOverlay: false
    })),
  addUserChoices: (choice) =>
    set((state: AppState) => ({
      userChoices: [...state.userChoices, choice],
    })),
  setSelectedChoice: (choice) =>
    set((_state: AppState) => ({
      selectedChoice: choice,
    })),
}));

export default useAppStore;
