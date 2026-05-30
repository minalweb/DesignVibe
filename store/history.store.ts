import { create } from 'zustand';
import { Layer } from '@/types/layer';
import { HistoryState } from '@/types/editor';

interface HistoryStore extends HistoryState {
  push: (snapshot: Layer[]) => void;
  undo: () => Layer[] | null;
  redo: () => Layer[] | null;
  canUndo: () => boolean;
  canRedo: () => boolean;
  clear: () => void;
}

const initialState: HistoryState = {
  past: [],
  present: [],
  future: [],
  limit: 50,
};

export const useHistoryStore = create<HistoryStore>((set, get) => ({
  ...initialState,
  
  push: (snapshot) =>
    set((state) => {
      const newPast = [...state.past, state.present];
      // Limit history size
      if (newPast.length > state.limit) {
        newPast.shift();
      }
      return {
        past: newPast,
        present: snapshot,
        future: [], // Clear redo stack when new action is performed
      };
    }),
  
  undo: () => {
    const state = get();
    if (state.past.length === 0) return null;
    
    const previous = state.past[state.past.length - 1];
    const newPast = state.past.slice(0, -1);
    
    set({
      past: newPast,
      present: previous,
      future: [state.present, ...state.future],
    });
    
    return previous;
  },
  
  redo: () => {
    const state = get();
    if (state.future.length === 0) return null;
    
    const next = state.future[0];
    const newFuture = state.future.slice(1);
    
    set({
      past: [...state.past, state.present],
      present: next,
      future: newFuture,
    });
    
    return next;
  },
  
  canUndo: () => get().past.length > 0,
  
  canRedo: () => get().future.length > 0,
  
  clear: () => set(initialState),
}));
