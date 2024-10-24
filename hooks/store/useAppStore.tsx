import { AppState } from '@/lib/types/app-state';
import { create } from 'zustand';

const useAppStore = create<AppState>((set) => ({
	selectedModel1: '',
	selectedModel2: '',
	prompt: '',

	setSelectedModel1: (model: string) => set((_state: AppState) => ({selectedModel1: model })),
	setSelectedModel2: (model: string) => set((_state: AppState) => ({ selectedModel2: model })),
	setPrompt: (prompt: string) => set((_state: AppState) => ({ prompt })),
}))

export default useAppStore;