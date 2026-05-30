'use client';

import { useCallback } from 'react';
import { useHistoryStore } from '@/store/history.store';
import { useLayerStore } from '@/store/layer.store';

export const useHistory = () => {
  const { push, undo, redo, canUndo, canRedo, clear } = useHistoryStore();
  const { setLayers } = useLayerStore();

  const handleUndo = useCallback(() => {
    const previous = undo();
    if (previous) {
      setLayers(previous);
    }
  }, [undo, setLayers]);

  const handleRedo = useCallback(() => {
    const next = redo();
    if (next) {
      setLayers(next);
    }
  }, [redo, setLayers]);

  const pushSnapshot = useCallback(
    (layers: any[]) => {
      push(layers);
    },
    [push]
  );

  return {
    canUndo: canUndo(),
    canRedo: canRedo(),
    undo: handleUndo,
    redo: handleRedo,
    push: pushSnapshot,
    clear,
  };
};
