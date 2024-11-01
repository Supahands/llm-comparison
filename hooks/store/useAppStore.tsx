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

  setSessionId: (sessionId: string) =>
    set((_state: AppState) => ({ sessionId: sessionId })),
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
  reset: () =>
    set((state: AppState) => ({
      responseModel1: "",
      responseModel2: "",
      isPendingModel1: false,
      isPendingModel2: false,
      selectedChoice: undefined,
      isComparingModel: false,
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
