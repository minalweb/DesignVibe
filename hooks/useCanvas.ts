'use client';

import { useRef, useCallback, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';

export const useCanvas = (canvasElement: HTMLCanvasElement | null) => {
  const canvasRef = useRef<FabricCanvas | null>(null);

  // Initialize canvas
  useEffect(() => {
    if (!canvasElement || canvasRef.current) return;

    const fabric = FabricCanvas;
    canvasRef.current = new fabric({
      container: canvasElement,
      width: 1200,
      height: 800,
      backgroundColor: '#ffffff',
    });

    return () => {
      canvasRef.current?.dispose();
      canvasRef.current = null;
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
