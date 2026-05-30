export interface TextDetectionResult {
  text: string;
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  fontSize?: number;
  fontFamily?: string;
}

export interface ShapeDetectionResult {
  type: 'rectangle' | 'circle' | 'polygon' | 'line';
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  confidence: number;
  points?: Array<{ x: number; y: number }>;
  fill?: string;
  stroke?: string;
}

export interface ColorResult {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsv: { h: number; s: number; v: number };
  usage: number;
}

export interface ImageAnalysisResult {
  textElements: TextDetectionResult[];
  shapes: ShapeDetectionResult[];
  colors: ColorResult[];
  dominantColor: ColorResult;
  imageUrl: string;
  dimensions: {
    width: number;
    height: number;
  };
}

export interface AnalysisPipeline {
  progress: number;
  currentStep: 'uploading' | 'analyzing_text' | 'detecting_shapes' | 'extracting_colors' | 'generating_layers' | 'complete' | 'error';
  message: string;
  error?: string;
}
