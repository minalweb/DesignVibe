'use client';

import { useRef, useEffect, useState } from 'react';
import { useLayers } from '@/hooks/useLayers';
import { useEditorStore } from '@/store/editor.store';

interface CanvasEditorProps {
  onImageAnalyzed?: () => void;
}

export const CanvasEditor = ({ onImageAnalyzed }: CanvasEditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<any>(null);
  const [isFabricLoaded, setIsFabricLoaded] = useState(false);
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

        setFabricCanvas(canvas);

        return () => {
          canvas.dispose();
        };
      } catch (error) {
        console.error('[v0] Failed to initialize Fabric canvas:', error);
      }
    };

    initCanvas();
  }, [fabricCanvas, isFabricLoaded]);

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
        layers.forEach((layer) => {
          if (!layer.visible) return;

          // Create Fabric object based on layer type
          let fabricObject;

          if (layer.data.type === 'text') {
            const textData = layer.data;
            fabricObject = new fabric.Text(textData.content, {
              left: layer.position.x,
              top: layer.position.y,
              fontSize: textData.fontSize,
              fontFamily: textData.fontFamily,
              fill: textData.fill,
              fontWeight: textData.fontWeight,
              fontStyle: textData.fontStyle,
            });
          } else if (layer.data.type === 'shape') {
            const shapeData = layer.data;
            if (shapeData.shapeType === 'rectangle') {
              fabricObject = new fabric.Rect({
                left: layer.position.x,
                top: layer.position.y,
                width: layer.dimensions.width,
                height: layer.dimensions.height,
                fill: shapeData.fill,
                stroke: shapeData.stroke,
                strokeWidth: shapeData.strokeWidth,
              });
            } else if (shapeData.shapeType === 'circle') {
              fabricObject = new fabric.Circle({
                left: layer.position.x,
                top: layer.position.y,
                radius: Math.min(layer.dimensions.width, layer.dimensions.height) / 2,
                fill: shapeData.fill,
                stroke: shapeData.stroke,
                strokeWidth: shapeData.strokeWidth,
              });
            }
          }

          if (fabricObject) {
            fabricObject.set({
              opacity: layer.opacity,
              angle: layer.rotation,
              data: { layerId: layer.id },
            });
            fabricCanvas.add(fabricObject);
          }
        });

        fabricCanvas.renderAll();
      } catch (error) {
        console.error('[v0] Error rendering layers:', error);
      }
    };

    renderLayers();
  }, [fabricCanvas, layers]);

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
