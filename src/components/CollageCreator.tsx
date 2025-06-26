import React, { useEffect, useRef } from 'react';
import { Photo, CollageLayout } from '../types';

interface CollageCreatorProps {
  photos: Photo[];
  layout: CollageLayout;
  onCollageGenerated: (dataUrl: string) => void;
}

const CollageCreator: React.FC<CollageCreatorProps> = ({ photos, layout, onCollageGenerated }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    generateCollage();
  }, [photos, layout]);

  const generateCollage = async () => {
    const canvas = canvasRef.current;
    if (!canvas || photos.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size based on layout
    const cellSize = 400; // Base size for each photo cell
    const padding = 20;
    const canvasWidth = layout.cols * cellSize + (layout.cols + 1) * padding;
    const canvasHeight = layout.rows * cellSize + (layout.rows + 1) * padding;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Create white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Calculate positions for photos
    const totalCells = layout.rows * layout.cols;
    const photosToUse = photos.slice(0, Math.min(photos.length, totalCells));

    let loadedImages = 0;
    const totalImages = photosToUse.length;

    const drawImage = (img: HTMLImageElement, row: number, col: number) => {
      const x = col * (cellSize + padding) + padding;
      const y = row * (cellSize + padding) + padding;

      // Create polaroid-style frame
      const frameSize = cellSize;
      const photoSize = frameSize - 40;
      const photoX = x + 20;
      const photoY = y + 20;

      // Draw frame shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 5;
      ctx.shadowOffsetY = 5;

      // Draw frame
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x, y, frameSize, frameSize);

      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Draw photo with proper aspect ratio
      const aspectRatio = img.width / img.height;
      let drawWidth = photoSize - 40;
      let drawHeight = drawWidth / aspectRatio;

      if (drawHeight > photoSize - 60) {
        drawHeight = photoSize - 60;
        drawWidth = drawHeight * aspectRatio;
      }

      const drawX = photoX + (photoSize - 40 - drawWidth) / 2;
      const drawY = photoY + (photoSize - 60 - drawHeight) / 2;

      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

      // Add timestamp
      ctx.fillStyle = '#666666';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      const timestamp = new Date().toLocaleDateString();
      ctx.fillText(timestamp, x + frameSize / 2, y + frameSize - 15);
    };

    // Load and draw all images
    photosToUse.forEach((photo, index) => {
      const img = new Image();
      img.onload = () => {
        const row = Math.floor(index / layout.cols);
        const col = index % layout.cols;
        drawImage(img, row, col);

        loadedImages++;
        if (loadedImages === totalImages) {
          // All images loaded, generate final collage
          const dataUrl = canvas.toDataURL('image/png', 0.95);
          onCollageGenerated(dataUrl);
        }
      };
      img.src = photo.dataUrl;
    });
  };

  return (
    <div className="space-y-4">
      <div 
        ref={previewRef}
        className="bg-white rounded-lg p-4 shadow-2xl max-w-full overflow-auto"
      >
        <canvas
          ref={canvasRef}
          className="max-w-full h-auto border border-gray-200 rounded"
        />
      </div>

      {/* Grid Preview */}
      <div className="grid gap-2 p-4 bg-white/5 rounded-lg">
        <div 
          className={`grid gap-1`}
          style={{
            gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
            gridTemplateRows: `repeat(${layout.rows}, 1fr)`,
          }}
        >
          {Array.from({ length: layout.rows * layout.cols }).map((_, index) => (
            <div
              key={index}
              className="aspect-square bg-white/10 rounded border-2 border-dashed border-white/20 flex items-center justify-center"
            >
              {index < photos.length ? (
                <img
                  src={photos[index].dataUrl}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <span className="text-white/50 text-xs">Empty</span>
              )}
            </div>
          ))}
        </div>
        <div className="text-center text-white/70 text-sm">
          Layout Preview: {layout.name}
        </div>
      </div>
    </div>
  );
};

export default CollageCreator;