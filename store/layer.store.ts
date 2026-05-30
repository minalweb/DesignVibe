import { create } from 'zustand';
import { Layer, LayerState } from '@/types/layer';

interface LayerStore extends LayerState {
  addLayer: (layer: Layer) => void;
  updateLayer: (id: string, updates: Partial<Layer>) => void;
  deleteLayer: (id: string) => void;
  reorderLayers: (fromIndex: number, toIndex: number) => void;
  setLayers: (layers: Layer[]) => void;
  duplicateLayer: (id: string) => void;
  toggleLayerVisibility: (id: string) => void;
  toggleLayerLock: (id: string) => void;
  getLayer: (id: string) => Layer | undefined;
  reset: () => void;
}

const initialState: LayerState = {
  layers: [],
  activeLayerId: null,
  selectedLayerIds: [],
};

export const useLayerStore = create<LayerStore>((set, get) => ({
  ...initialState,
  
  addLayer: (layer) => 
    set((state) => ({
      layers: [layer, ...state.layers],
      activeLayerId: layer.id,
    })),
  
  updateLayer: (id, updates) =>
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === id ? { ...layer, ...updates } : layer
      ),
    })),
  
  deleteLayer: (id) =>
    set((state) => ({
      layers: state.layers.filter((layer) => layer.id !== id),
      activeLayerId:
        state.activeLayerId === id ? null : state.activeLayerId,
      selectedLayerIds: state.selectedLayerIds.filter((layerId) => layerId !== id),
    })),
  
  reorderLayers: (fromIndex, toIndex) =>
    set((state) => {
      const newLayers = [...state.layers];
      const [removed] = newLayers.splice(fromIndex, 1);
      newLayers.splice(toIndex, 0, removed);
      return { layers: newLayers };
    }),
  
  setLayers: (layers) => set({ layers }),
  
  duplicateLayer: (id) =>
    set((state) => {
      const layer = state.layers.find((l) => l.id === id);
      if (!layer) return state;
      const duplicate: Layer = {
        ...layer,
        id: `${layer.id}-copy-${Date.now()}`,
        name: `${layer.name} copy`,
      };
      return {
        layers: [duplicate, ...state.layers],
        activeLayerId: duplicate.id,
      };
    }),
  
  toggleLayerVisibility: (id) =>
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === id ? { ...layer, visible: !layer.visible } : layer
      ),
    })),
  
  toggleLayerLock: (id) =>
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === id ? { ...layer, locked: !layer.locked } : layer
      ),
    })),
  
  getLayer: (id) => {
    const state = get();
    return state.layers.find((layer) => layer.id === id);
  },
  
  reset: () => set(initialState),
}));
