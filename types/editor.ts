import { Layer } from './layer';

export interface EditorState {
  mode: 'select' | 'text' | 'shape' | 'pan';
  isDragging: boolean;
  isResizing: boolean;
  selectedLayerIds: string[];
  activeLayerId: string | null;
  clipboard?: Layer[];
  isAnalyzing: boolean;
  analysisProgress: number;
}

export interface EditorConfig {
  canvasWidth: number;
  canvasHeight: number;
  backgroundColor: string;
  defaultFontSize: number;
  defaultFontFamily: string;
}

export interface HistoryState {
  past: Layer[][];
  present: Layer[];
  future: Layer[][];
  limit: number;
}

export interface UndoRedoAction {
  type: 'undo' | 'redo';
  snapshot: Layer[];
}
