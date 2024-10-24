export interface AppState {
  selectedModel1: string;
  selectedModel2: string;
  prompt: string;
  setSelectedModel1: (model: string) => void;
  setSelectedModel2: (model: string) => void;
  setPrompt: (prompt: string) => void;
}