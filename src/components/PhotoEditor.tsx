import React, { useState, useRef, useEffect } from 'react';
import { X, Save, RotateCcw, Palette } from 'lucide-react';
import { Photo, PhotoFilters, PHOTO_FILTERS } from '../types';

interface PhotoEditorProps {
  photo: Photo;
  onSave: (editedPhoto: Photo) => void;
  onClose: () => void;
}

const PhotoEditor: React.FC<PhotoEditorProps> = ({ photo, onSave, onClose }) => {
  const [filters, setFilters] = useState<PhotoFilters>({
    brightness: photo.filters?.brightness || 1,
    contrast: photo.filters?.contrast || 1,
    saturation: photo.filters?.saturation || 1,
    sharpness: photo.filters?.sharpness || 1,
    filter: photo.filters?.filter || 'none',
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [previewUrl, setPreviewUrl] = useState(photo.dataUrl);

  const applyFilters = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.filter = `
        brightness(${filters.brightness})
        contrast(${filters.contrast})
        saturate(${filters.saturation})
        ${filters.filter === 'none' ? '' : filters.filter}
      `;

      ctx.drawImage(img, 0, 0);
      setPreviewUrl(canvas.toDataURL('image/png', 0.95));
    };
    img.src = photo.dataUrl;
  };

  useEffect(() => {
    applyFilters();
  }, [filters, photo.dataUrl]);

  const handleSave = () => {
    const editedPhoto: Photo = {
      ...photo,
      dataUrl: previewUrl,
      filters,
      edited: true,
    };
    onSave(editedPhoto);
  };

  const handleReset = () => {
    setFilters({
      brightness: 1,
      contrast: 1,
      saturation: 1,
      sharpness: 1,
      filter: 'none',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Palette className="w-6 h-6 text-cyan-400" />
            <span>Edit Photo</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-300" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Preview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Preview</h3>
            <div className="bg-black rounded-lg p-4">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-auto max-h-96 object-contain rounded"
              />
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Adjustments</h3>
            
            {/* Basic Adjustments */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Brightness: {Math.round((filters.brightness - 1) * 100)}%
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={filters.brightness}
                  onChange={(e) => setFilters(prev => ({ ...prev, brightness: parseFloat(e.target.value) }))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Contrast: {Math.round((filters.contrast - 1) * 100)}%
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={filters.contrast}
                  onChange={(e) => setFilters(prev => ({ ...prev, contrast: parseFloat(e.target.value) }))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Saturation: {Math.round((filters.saturation - 1) * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={filters.saturation}
                  onChange={(e) => setFilters(prev => ({ ...prev, saturation: parseFloat(e.target.value) }))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>

            {/* Filter Presets */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Filters</label>
              <div className="grid grid-cols-2 gap-2">
                {PHOTO_FILTERS.map((filterPreset) => (
                  <button
                    key={filterPreset.id}
                    onClick={() => setFilters(prev => ({ ...prev, filter: filterPreset.filter }))}
                    className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      filters.filter === filterPreset.filter
                        ? 'bg-cyan-500 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {filterPreset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                onClick={handleReset}
                className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-cyan-500 to-pink-500 text-white rounded-lg hover:from-cyan-600 hover:to-pink-600 transition-all duration-200"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default PhotoEditor;