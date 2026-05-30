import { ImageAnalysisResult } from '@/types/analysis';
import { Layer } from '@/types/layer';
import { detectText, disposeTesseract } from './text-detector';
import { detectShapes } from './shape-detector';
import { extractColors } from './color-extractor';
import { generateLayers, generateColorSwatches } from './layer-generator';

export interface AnalysisProgressCallback {
  (progress: number, step: string): void;
}

/**
 * Complete image analysis pipeline
 */
export const analyzeImage = async (
  imageUrl: string,
  onProgress?: AnalysisProgressCallback
): Promise<{ result: ImageAnalysisResult; layers: Layer[] }> => {
  try {
    const analysisResult: ImageAnalysisResult = {
      textElements: [],
      shapes: [],
      colors: [],
      dominantColor: { hex: '#000000', rgb: { r: 0, g: 0, b: 0 }, hsv: { h: 0, s: 0, v: 0 }, usage: 0 },
      imageUrl,
      dimensions: { width: 1200, height: 800 },
    };

    // Step 1: Get image dimensions
    onProgress?.(10, 'Loading image...');
    const dimensions = await getImageDimensions(imageUrl);
    analysisResult.dimensions = dimensions;

    // Step 2: Extract colors
    onProgress?.(25, 'Extracting colors...');
    const colors = await extractColors(imageUrl);
    analysisResult.colors = colors;
    analysisResult.dominantColor = colors[0] || analysisResult.dominantColor;

    // Step 3: Detect text
    onProgress?.(50, 'Detecting text...');
    const textElements = await detectText(imageUrl);
    analysisResult.textElements = textElements;

    // Step 4: Detect shapes
    onProgress?.(75, 'Detecting shapes...');
    const shapes = await detectShapes(imageUrl);
    analysisResult.shapes = shapes;

    // Step 5: Generate layers
    onProgress?.(90, 'Generating layers...');
    const layers = generateLayers(textElements, shapes, colors);
    
    // Add image layer at bottom
    const imageLayers: Layer[] = [
      {
        id: 'image-base',
        name: 'Image',
        position: { x: 0, y: 0 },
        dimensions,
        rotation: 0,
        opacity: 1,
        visible: true,
        locked: false,
        blendMode: 'normal',
        zIndex: 0,
        data: {
          type: 'image',
          src: imageUrl,
          opacity: 1,
        },
      },
      ...layers,
    ];

    onProgress?.(100, 'Complete');

    return {
      result: analysisResult,
      layers: imageLayers,
    };
  } catch (error) {
    console.error('Analysis pipeline error:', error);
    throw error;
  } finally {
    await disposeTesseract();
  }
};

/**
 * Get image dimensions
 */
const getImageDimensions = async (
  imageUrl: string
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      resolve({
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
      });
    };

    img.onerror = () => {
      resolve({ width: 1200, height: 800 });
    };

    img.src = imageUrl;
  });
};

/**
 * Batch analyze multiple images
 */
export const analyzeImages = async (
  imageUrls: string[],
  onProgress?: AnalysisProgressCallback
) => {
  const results = [];

  for (let i = 0; i < imageUrls.length; i++) {
    const overallProgress = (i / imageUrls.length) * 100;
    const wrappedProgress = (stepProgress: number, step: string) => {
      const totalProgress = overallProgress + (stepProgress / imageUrls.length);
      onProgress?.(totalProgress, `[${i + 1}/${imageUrls.length}] ${step}`);
    };

    const result = await analyzeImage(imageUrls[i], wrappedProgress);
    results.push(result);
  }

  return results;
};
