import { AppState } from "@/lib/types/app-state";
import { create } from "zustand";

const useAppStore = create<AppState>((set) => ({
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
  reset: () =>
    set((state: AppState) => ({
      responseModel1: "",
      responseModel2: "",
      isPendingModel1: false,
      isPendingModel2: false,
      selectedChoice: undefined,
      isComparingModel: false
    })),
  addUserChoices: (choice) => set((state: AppState) => ({
    userChoices: [...state.userChoices, choice]
  })),
  setSelectedChoice: (choice) => set((_state: AppState) => ({
    selectedChoice: choice
  }))
}));

export default useAppStore;
