'use client';

import { useCallback } from 'react';
import { useLayerStore } from '@/store/layer.store';
import { useHistoryStore } from '@/store/history.store';
import { Layer } from '@/types/layer';
import { generateId } from '@/utils/helpers';

export const useLayers = () => {
  const {
    layers,
    activeLayerId,
    selectedLayerIds,
    addLayer,
    updateLayer,
    deleteLayer,
    setLayers,
    duplicateLayer,
    toggleLayerVisibility,
    toggleLayerLock,
    getLayer,
    setSelectedLayerIds,
  } = useLayerStore();

  const historyPush = useHistoryStore((state) => state.push);

  const createNewLayer = useCallback(
    (layerData: Partial<Layer>) => {
      const newLayer: Layer = {
        id: generateId('layer'),
        name: `Layer ${layers.length + 1}`,
        position: { x: 0, y: 0 },
        dimensions: { width: 100, height: 100 },
        rotation: 0,
        opacity: 1,
        visible: true,
        locked: false,
        blendMode: 'normal',
        zIndex: layers.length,
        data: {
          type: 'shape',
          shapeType: 'rectangle',
          fill: '#000000',
          stroke: '#000000',
          strokeWidth: 1,
          opacity: 1,
        },
        ...layerData,
      };

      addLayer(newLayer);
      historyPush([newLayer, ...layers]);
      return newLayer;
    },
    [layers, addLayer, historyPush]
  );

  const removeLayer = useCallback(
    (id: string) => {
      deleteLayer(id);
      const newLayers = layers.filter((l) => l.id !== id);
      historyPush(newLayers);
    },
    [layers, deleteLayer, historyPush]
  );

  const changeLayer = useCallback(
    (id: string, updates: Partial<Layer>) => {
      updateLayer(id, updates);
      historyPush(layers.map((l) => (l.id === id ? { ...l, ...updates } : l)));
    },
    [layers, updateLayer, historyPush]
  );

  const duplicateSelected = useCallback(() => {
    if (!activeLayerId) return;
    duplicateLayer(activeLayerId);
    historyPush([...layers]);
  }, [activeLayerId, duplicateLayer, layers, historyPush]);

  const selectAllLayers = useCallback(() => {
    const allLayerIds = layers.map((layer) => layer.id);
    setSelectedLayerIds(allLayerIds);
  }, [layers]);

  return {
    layers,
    activeLayerId,
    selectedLayerIds,
    createNewLayer,
    removeLayer,
    changeLayer,
    duplicateSelected,
    selectAllLayers,
    toggleLayerVisibility,
    toggleLayerLock,
    getLayer,
  };
};
