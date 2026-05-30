import { Canvas as FabricCanvas } from 'fabric';

export interface CanvasState {
  zoom: number;
  panX: number;
  panY: number;
  width: number;
  height: number;
  gridSize: number;
  showGrid: boolean;
  snapToGrid: boolean;
}

export interface CanvasConfig {
  width: number;
  height: number;
  backgroundColor: string;
  gridSize: number;
  zoom: number;
}

export interface ExportOptions {
  format: 'png' | 'svg' | 'json';
  quality?: number;
  includeBackground?: boolean;
}

export interface CanvasRenderOptions {
  renderGrid?: boolean;
  renderGuides?: boolean;
}
