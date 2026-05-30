import { create } from 'zustand';
import { EditorState } from '@/types/editor';

interface EditorStore extends EditorState {
  setMode: (mode: EditorState['mode']) => void;
  setDragging: (isDragging: boolean) => void;
  setResizing: (isResizing: boolean) => void;
  setSelectedLayers: (layerIds: string[]) => void;
  setActiveLayers: (layerId: string | null) => void;
  setClipboard: (layers: any[]) => void;
  setAnalyzing: (isAnalyzing: boolean) => void;
  setAnalysisProgress: (progress: number) => void;
  reset: () => void;
}

const initialState: EditorState = {
  mode: 'select',
  isDragging: false,
  isResizing: false,
  selectedLayerIds: [],
  activeLayerId: null,
  clipboard: undefined,
  isAnalyzing: false,
  analysisProgress: 0,
};

export const useEditorStore = create<EditorStore>((set) => ({
  ...initialState,
  setMode: (mode) => set({ mode }),
  setDragging: (isDragging) => set({ isDragging }),
  setResizing: (isResizing) => set({ isResizing }),
  setSelectedLayers: (selectedLayerIds) => set({ selectedLayerIds }),
  setActiveLayers: (activeLayerId) => set({ activeLayerId }),
  setClipboard: (clipboard) => set({ clipboard }),
  setAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  setAnalysisProgress: (analysisProgress) => set({ analysisProgress }),
  reset: () => set(initialState),
}));
