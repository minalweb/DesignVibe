'use client';

import { useEffect, useRef } from 'react';
import { useHistory } from './useHistory';
import { useLayerStore } from '@/store/layer.store';
import { useLayers } from './useLayers';

// Clipboard storage for layers
let clipboardLayers: any[] = [];

export const useKeyboardShortcuts = () => {
  const { undo, redo, canUndo, canRedo } = useHistory();
  const { removeLayer, duplicateSelected, selectAllLayers } = useLayers();
  const { activeLayerId, selectedLayerIds, setSelectedLayerIds } = useLayerStore();
  const { layers } = useLayers();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMeta = event.metaKey || event.ctrlKey;

      // Undo (Ctrl+Z / Cmd+Z)
      if (isMeta && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        if (canUndo) {
          undo();
          console.log('[v0] Undo');
        }
      }

      // Redo (Ctrl+Shift+Z / Cmd+Shift+Z)
      if (isMeta && event.key === 'z' && event.shiftKey) {
        event.preventDefault();
        if (canRedo) {
          redo();
          console.log('[v0] Redo');
        }
      }

      // Delete (Delete / Backspace)
      if ((event.key === 'Delete' || event.key === 'Backspace') && selectedLayerIds.length > 0) {
        event.preventDefault();
        selectedLayerIds.forEach((id) => removeLayer(id));
        console.log('[v0] Deleted', selectedLayerIds.length, 'layer(s)');
      }

      // Duplicate (Ctrl+D / Cmd+D)
      if (isMeta && event.key === 'd' && activeLayerId) {
        event.preventDefault();
        duplicateSelected();
        console.log('[v0] Duplicated layer:', activeLayerId);
      }

      // Select All (Ctrl+A / Cmd+A)
      if (isMeta && event.key === 'a') {
        event.preventDefault();
        if (selectAllLayers) {
          selectAllLayers();
          console.log('[v0] Selected all layers');
        }
      }

      // Copy (Ctrl+C / Cmd+C)
      if (isMeta && event.key === 'c' && selectedLayerIds.length > 0) {
        event.preventDefault();
        const layersToCopy = layers.filter((l) => selectedLayerIds.includes(l.id));
        clipboardLayers = JSON.parse(JSON.stringify(layersToCopy));
        console.log('[v0] Copied', selectedLayerIds.length, 'layer(s) to clipboard');
      }

      // Paste (Ctrl+V / Cmd+V)
      if (isMeta && event.key === 'v' && clipboardLayers.length > 0) {
        event.preventDefault();
        try {
          // Paste functionality - create new layers with offset
          clipboardLayers.forEach((layer) => {
            const newLayer = {
              ...layer,
              id: `layer-${Date.now()}-${Math.random()}`,
              position: {
                x: layer.position.x + 20,
                y: layer.position.y + 20,
              },
            };
            useLayerStore.setState((state) => ({
              layers: [...state.layers, newLayer],
            }));
          });
          console.log('[v0] Pasted', clipboardLayers.length, 'layer(s)');
        } catch (error) {
          console.error('[v0] Error pasting layers:', error);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, canUndo, canRedo, removeLayer, duplicateSelected, activeLayerId, selectedLayerIds, selectAllLayers, layers, setSelectedLayerIds]);
};
