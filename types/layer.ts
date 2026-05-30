export interface Position {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export type LayerType = 'text' | 'shape' | 'image' | 'group';
export type ShapeType = 'rectangle' | 'circle' | 'polygon' | 'line';

export interface TextLayer {
  type: 'text';
  content: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  fontStyle: 'normal' | 'italic';
  letterSpacing: number;
  lineHeight: number;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  fill: string;
}

export interface ShapeLayer {
  type: 'shape';
  shapeType: ShapeType;
  fill: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
  shadow?: {
    blur: number;
    offsetX: number;
    offsetY: number;
    color: string;
  };
}

export interface ImageLayer {
  type: 'image';
  src: string;
  opacity: number;
}

export interface Layer {
  id: string;
  name: string;
  position: Position;
  dimensions: Dimensions;
  rotation: number;
  opacity: number;
  visible: boolean;
  locked: boolean;
  blendMode: string;
  data: TextLayer | ShapeLayer | ImageLayer;
  parentId?: string;
  zIndex: number;
}

export interface LayerState {
  layers: Layer[];
  activeLayerId: string | null;
  selectedLayerIds: string[];
}
