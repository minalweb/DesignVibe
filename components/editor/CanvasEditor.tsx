'use client';

import { useRef, useEffect, useState } from 'react';
import type { Canvas as FabricCanvas } from 'fabric';
import { useLayers } from '@/hooks/useLayers';
import { useEditorStore } from '@/store/editor.store';

interface CanvasEditorProps {
  onImageAnalyzed?: () => void;
}

export const CanvasEditor = ({ onImageAnalyzed }: CanvasEditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [isFabricLoaded, setIsFabricLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { layers } = useLayers();
  const { mode } = useEditorStore();

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current || fabricCanvas || !isFabricLoaded) return;

    const initCanvas = async () => {
      try {
        if (!canvasRef.current) return;
        const fabricModule = await import('fabric');
        const fabric = fabricModule.default || fabricModule;
        
        const canvas = new fabric.Canvas(canvasRef.current, {
          width: 1200,
          height: 800,
          backgroundColor: '#ffffff',
          selection: true,
          preserveObjectStacking: true,
        });

        if (!canvas) {
          throw new Error('Failed to create Fabric canvas');
        }

        setFabricCanvas(canvas);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('[v0] Failed to initialize Fabric canvas:', errorMessage);
        setError('Failed to initialize canvas. Please refresh the page.');
      }
    };

    initCanvas();

    // Cleanup
    return () => {
      // Canvas will be disposed when component unmounts
    };
  }, [isFabricLoaded]);

  // Load Fabric library
  useEffect(() => {
    setIsFabricLoaded(true);
  }, []);

  // Render layers on canvas
  useEffect(() => {
    if (!fabricCanvas) return;

    const renderLayers = async () => {
      try {
        const fabricModule = await import('fabric');
        const fabric = fabricModule.default || fabricModule;
        
        fabricCanvas.clear();

        // Render each layer
        for (const layer of layers) {
          if (!layer.visible) continue;

          try {
            // Create Fabric object based on layer type
            let fabricObject: any = null;

            if (layer.data.type === 'text') {
              const textData = layer.data as any;
              fabricObject = new fabric.Text(textData.content || '', {
                left: layer.position.x,
                top: layer.position.y,
                fontSize: textData.fontSize || 16,
                fontFamily: textData.fontFamily || 'Arial',
                fill: textData.fill || '#000000',
                fontWeight: textData.fontWeight || 'normal',
                fontStyle: textData.fontStyle || 'normal',
              });
            } else if (layer.data.type === 'shape') {
              const shapeData = layer.data as any;
              if (shapeData.shapeType === 'rectangle') {
                fabricObject = new fabric.Rect({
                  left: layer.position.x,
                  top: layer.position.y,
                  width: layer.dimensions.width,
                  height: layer.dimensions.height,
                  fill: shapeData.fill || '#3b82f6',
                  stroke: shapeData.stroke || '#000000',
                  strokeWidth: shapeData.strokeWidth || 1,
                });
              } else if (shapeData.shapeType === 'circle') {
                fabricObject = new fabric.Circle({
                  left: layer.position.x,
                  top: layer.position.y,
                  radius: Math.min(layer.dimensions.width, layer.dimensions.height) / 2,
                  fill: shapeData.fill || '#8b5cf6',
                  stroke: shapeData.stroke || '#000000',
                  strokeWidth: shapeData.strokeWidth || 1,
                });
              }
            }

            if (fabricObject) {
              fabricObject.set({
                opacity: layer.opacity,
                angle: layer.rotation,
                selectable: !layer.locked,
                evented: !layer.locked,
                data: { layerId: layer.id },
              });
              fabricCanvas.add(fabricObject);
            }
          } catch (layerError) {
            console.warn('[v0] Failed to render layer:', layer.id, layerError);
          }
        }

        fabricCanvas.renderAll();
        setError(null);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('[v0] Error rendering layers:', errorMessage);
        setError('Failed to render canvas');
      }
    };

    renderLayers();
  }, [fabricCanvas, layers]);

  if (error) {
    return (
      <div ref={containerRef} className="w-full h-full flex items-center justify-center bg-neutral-900">
        <div className="text-center">
          <p className="text-red-400 font-semibold mb-2">Canvas Error</p>
          <p className="text-neutral-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center bg-neutral-900">
      <canvas
        ref={canvasRef}
        className="border border-neutral-700 shadow-lg"
        style={{ maxWidth: '100%', maxHeight: '100%' }}
      />
    </div>
  );
};
