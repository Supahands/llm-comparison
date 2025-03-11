import { ComboBoxItem } from "@/components/ui/combo-box";
import { AppState, Prompt } from "@/lib/types/app-state";
import { create } from "zustand";

const useAppStore = create<AppState>((set) => ({
  sessionId: "",
  selectedModel1: "",
  selectedModel2: "",
  prompt: undefined,
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
  roundCounter: 0,
  hasRoundEnded: false,
  isRetryOverlay: false,
  responseOrder: undefined,
  temperature: 0.7,
  topP: 1.0,
  maxTokens: 1000,
  systemPrompt: "",
  jsonFormat: false,
  images: [],
  isModel1Multimodal: false,
  isModel2Multimodal: false,
  explainChoice: "",
  idealResponse: "",
  preferredTags: [],
  maxTagCount: 10,
  showExplanationFields: false,
  useAIGeneratedPrompt: false,
  isSingleModelMode: false,

  setShowExplanationFields: (show: boolean) => set({ showExplanationFields: show }),
  setRoundCounter: (counter: number) => set({ roundCounter: counter }),
  setSessionId: (sessionId: string) =>
    set((_state: AppState) => ({ sessionId: sessionId })),
  setExplainChoice: (explainChoice: string) =>
    set((_state: AppState) => ({ explainChoice: explainChoice })),
  setIdealResponse: (idealResponse: string) =>
    set((_state: AppState) => ({ idealResponse: idealResponse })),
  setIsModel1Multimodal: (multimodal: boolean) =>
    set((_state: AppState) => ({ isModel1Multimodal: multimodal })),
  setIsModel2Multimodal: (multimodal: boolean) =>
    set((_state: AppState) => ({ isModel2Multimodal: multimodal })),
  setPromptToken: (promptToken: number) =>
    set((_state: AppState) => ({ promptToken: promptToken })),
  setJSONFormat: (jsonFormat: boolean) =>
    set((_state: AppState) => ({ jsonFormat: jsonFormat })),
  setSystemPrompt: (systemPrompt: string) =>
    set((_state: AppState) => ({ systemPrompt: systemPrompt })),
  setCompletionToken1: (completionToken1: number) =>
    set((_state: AppState) => ({ completionToken1: completionToken1 })),
  setCompletionToken2: (completionToken2: number) =>
    set((_state: AppState) => ({ completionToken2: completionToken2 })),
  setTemperature: (temperature: number) =>
    set((_state: AppState) => ({ temperature: temperature })),
  setTopP: (topP: number) => set((_state: AppState) => ({ topP: topP })),
  setMaxTokens: (maxTokens: number) =>
    set((_state: AppState) => ({ maxTokens: maxTokens })),
  setResponseTime1: (response_time: number) =>
    set((_state: AppState) => ({ responseTime1: response_time })),
  setResponseTime2: (response_time: number) =>
    set((_state: AppState) => ({ responseTime2: response_time })),
  setSelectedModel1: (model: string) =>
    set((_state: AppState) => ({ selectedModel1: model })),
  setSelectedModel2: (model: string) =>
    set((_state: AppState) => ({ selectedModel2: model })),
  setPrompt: (prompt: Prompt) => set((_state: AppState) => ({ prompt })),
  setPreferredTags: (tags: string[]) => set((_state: AppState) => ({ preferredTags: tags })),
  setMaxTagCount: (maxTagCount: number) => set((_state: AppState) => ({ maxTagCount })), // Added this line
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
  setIsRetryOverlay: (isOverlay) =>
    set((_state: AppState) => ({ isRetryOverlay: isOverlay })),
  setModelOrder: (order) =>
    set((_state: AppState) => ({ responseOrder: order })),
  setUseAIGeneratedPrompt: (useAIGeneratedPrompt: boolean) =>
    set((_state: AppState) => ({ useAIGeneratedPrompt })),
  setIsSingleModelMode: (isSingleModelMode: boolean) =>
    set((_state: AppState) => ({ isSingleModelMode })),
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
      isRetryOverlay: false,
      explainChoice: "",
      idealResponse: "",
      useAIGeneratedPrompt: false,
    })),
  addUserChoices: (choice) =>
    set((state: AppState) => ({
      userChoices: [...state.userChoices, choice],
    })),
  setImages: (updater) =>
    set((state) => ({
      images: updater(state.images), // Apply the updater function to modify the images array
    })),
  setSelectedChoice: (choice) =>
    set((_state: AppState) => ({
      selectedChoice: choice,
    })),
}));

export default useAppStore;
