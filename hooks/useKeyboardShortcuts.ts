'use client';

import { useEffect } from 'react';
import { useHistory } from './useHistory';
import { useLayerStore } from '@/store/layer.store';
import { useLayers } from './useLayers';

export const useKeyboardShortcuts = () => {
  const { undo, redo, canUndo, canRedo } = useHistory();
  const { removeLayer, duplicateSelected } = useLayers();
  const { activeLayerId, selectedLayerIds } = useLayerStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMeta = event.metaKey || event.ctrlKey;

      // Undo (Ctrl+Z / Cmd+Z)
      if (isMeta && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        if (canUndo) undo();
      }

      // Redo (Ctrl+Shift+Z / Cmd+Shift+Z)
      if (isMeta && event.key === 'z' && event.shiftKey) {
        event.preventDefault();
        if (canRedo) redo();
      }

      // Delete (Delete / Backspace)
      if ((event.key === 'Delete' || event.key === 'Backspace') && selectedLayerIds.length > 0) {
        event.preventDefault();
        selectedLayerIds.forEach((id) => removeLayer(id));
      }

      // Duplicate (Ctrl+D / Cmd+D)
      if (isMeta && event.key === 'd' && activeLayerId) {
        event.preventDefault();
        duplicateSelected();
      }

      // Select All (Ctrl+A / Cmd+A)
      if (isMeta && event.key === 'a') {
        event.preventDefault();
        // This would need integration with the actual layer selection
      }

      // Copy (Ctrl+C / Cmd+C)
      if (isMeta && event.key === 'c' && selectedLayerIds.length > 0) {
        event.preventDefault();
        // Implement clipboard functionality
      }

      // Paste (Ctrl+V / Cmd+V)
      if (isMeta && event.key === 'v') {
        event.preventDefault();
        // Implement paste functionality
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, canUndo, canRedo, removeLayer, duplicateSelected, activeLayerId, selectedLayerIds]);
};
