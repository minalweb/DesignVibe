'use client';

import { useRef, useCallback, useEffect } from 'react';

export const useCanvas = (canvasElement: HTMLCanvasElement | null) => {
  const canvasRef = useRef<any>(null);

  // Initialize canvas
  useEffect(() => {
    if (!canvasElement || canvasRef.current) return;

    const initCanvas = async () => {
      try {
        const fabricModule = await import('fabric');
        const fabric = fabricModule.default || fabricModule;

        canvasRef.current = new fabric.Canvas(canvasElement, {
          width: 1200,
          height: 800,
          backgroundColor: '#ffffff',
        });
      } catch (error) {
        console.error('[v0] Failed to initialize canvas:', error);
      }
    };

    initCanvas();

    return () => {
      if (canvasRef.current) {
        canvasRef.current.dispose();
        canvasRef.current = null;
      }
    };
  }, [canvasElement]);

  const getCanvas = useCallback(() => canvasRef.current, []);

  const addObject = useCallback((object: any) => {
    if (canvasRef.current) {
      canvasRef.current.add(object);
      canvasRef.current.renderAll();
    }
  }, []);

  const removeObject = useCallback((object: any) => {
    if (canvasRef.current) {
      canvasRef.current.remove(object);
      canvasRef.current.renderAll();
    }
  }, []);

  const clear = useCallback(() => {
    if (canvasRef.current) {
      canvasRef.current.clear();
    }
  }, []);

  const setZoom = useCallback((zoom: number) => {
    if (canvasRef.current) {
      canvasRef.current.setZoom(zoom);
      canvasRef.current.renderAll();
    }
  }, []);

  const getZoom = useCallback(() => {
    return canvasRef.current?.getZoom() || 1;
  }, []);

  const toDataURL = useCallback((format = 'png') => {
    return canvasRef.current?.toDataURL({ format }) || '';
  }, []);

  const exportToSVG = useCallback(() => {
    return canvasRef.current?.toSVG() || '';
  }, []);

  return {
    canvas: canvasRef.current,
    getCanvas,
    addObject,
    removeObject,
    clear,
    setZoom,
    getZoom,
    toDataURL,
    exportToSVG,
  };
};
