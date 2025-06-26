export interface Photo {
  id: string;
  dataUrl: string;
  timestamp: Date;
  filters?: PhotoFilters;
  edited?: boolean;
}

export interface PhotoFilters {
  brightness: number;
  contrast: number;
  saturation: number;
  sharpness: number;
  filter: string;
}

export interface CollageLayout {
  id: string;
  name: string;
  rows: number;
  cols: number;
  aspectRatio: string;
}

export const COLLAGE_LAYOUTS: CollageLayout[] = [
  { id: '2x2', name: '2×2 Grid', rows: 2, cols: 2, aspectRatio: 'aspect-square' },
  { id: '2x4', name: '2×4 Strip', rows: 4, cols: 2, aspectRatio: 'aspect-[2/4]' },
  { id: '3x2', name: '3×2 Wide', rows: 2, cols: 3, aspectRatio: 'aspect-[3/2]' },
  { id: '4x2', name: '4×2 Banner', rows: 2, cols: 4, aspectRatio: 'aspect-[4/2]' },
];

export const PHOTO_FILTERS = [
  { id: 'none', name: 'Original', filter: 'none' },
  { id: 'vintage', name: 'Vintage', filter: 'sepia(0.8) contrast(1.2) brightness(1.1)' },
  { id: 'neon', name: 'Neon', filter: 'contrast(1.4) saturate(1.8) hue-rotate(30deg)' },
  { id: 'cool', name: 'Cool', filter: 'hue-rotate(180deg) saturate(1.3)' },
  { id: 'warm', name: 'Warm', filter: 'hue-rotate(-30deg) saturate(1.2) brightness(1.1)' },
  { id: 'sparkle', name: 'Sparkle', filter: 'contrast(1.3) brightness(1.2) saturate(1.4)' },
  { id: 'bloom', name: 'Bloom', filter: 'blur(0.5px) brightness(1.3) contrast(1.1)' },
];