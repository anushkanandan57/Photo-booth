import React from 'react';
import { Edit3, Download, Trash2 } from 'lucide-react';
import { Photo } from '../types';

interface PhotoFrameProps {
  photo: Photo;
  onEdit: () => void;
  onDelete: () => void;
}

const PhotoFrame: React.FC<PhotoFrameProps> = ({ photo, onEdit, onDelete }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = photo.dataUrl;
    link.download = `photo-${photo.id}.png`;
    link.click();
  };

  return (
    <div className="group relative">
      {/* Polaroid Frame */}
      <div className="bg-white p-3 pb-8 rounded-lg shadow-xl transform transition-all duration-200 hover:scale-105 hover:shadow-2xl">
        <div className="relative overflow-hidden rounded">
          <img
            src={photo.dataUrl}
            alt={`Captured on ${photo.timestamp.toLocaleDateString()}`}
            className="w-full h-32 object-cover"
            style={{
              filter: photo.filters?.filter || 'none',
              brightness: photo.filters?.brightness || 1,
              contrast: photo.filters?.contrast || 1,
              saturate: photo.filters?.saturation || 1,
            }}
          />
          
          {/* Photo Actions Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-2">
            <button
              onClick={onEdit}
              className="p-2 bg-cyan-500 text-white rounded-full hover:bg-cyan-600 transition-colors"
              title="Edit Photo"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
              title="Download Photo"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              title="Delete Photo"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Polaroid Caption */}
        <div className="mt-2 text-center">
          <p className="text-xs text-gray-600 font-handwriting">
            {photo.timestamp.toLocaleDateString()} {photo.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
          {photo.edited && (
            <span className="inline-block mt-1 px-2 py-0.5 bg-cyan-100 text-cyan-800 text-xs rounded-full">
              Edited
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotoFrame;