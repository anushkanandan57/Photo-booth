import React, { useState, useRef, useCallback } from 'react';
import { Camera, Timer, Zap, Settings, Download } from 'lucide-react';
import CameraCapture from './CameraCapture';
import PhotoFrame from './PhotoFrame';
import PhotoEditor from './PhotoEditor';
import { Photo } from '../types';

interface PhotoBoothProps {
  onPhotosComplete: (photos: Photo[]) => void;
}

const PhotoBooth: React.FC<PhotoBoothProps> = ({ onPhotosComplete }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [maxPhotos, setMaxPhotos] = useState(4);
  const [useTimer, setUseTimer] = useState(false);

  const handlePhotoCapture = useCallback((photoDataUrl: string) => {
    const newPhoto: Photo = {
      id: Date.now().toString(),
      dataUrl: photoDataUrl,
      timestamp: new Date(),
    };
    
    setPhotos(prev => [...prev, newPhoto]);
    setIsCapturing(false);
  }, []);

  const handlePhotoEdit = useCallback((editedPhoto: Photo) => {
    setPhotos(prev => prev.map(p => p.id === editedPhoto.id ? editedPhoto : p));
    setSelectedPhoto(null);
  }, []);

  const handleDeletePhoto = useCallback((photoId: string) => {
    setPhotos(prev => prev.filter(p => p.id !== photoId));
  }, []);

  const canTakeMore = photos.length < maxPhotos;
  const isEvenNumber = photos.length % 2 === 0;
  const canComplete = photos.length >= 2 && isEvenNumber;

  return (
    <div className="min-h-screen p-4 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <Camera className="w-8 h-8 text-cyan-400" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
            Modern Photobooth
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
            <Settings className="w-4 h-4 text-gray-300" />
            <select 
              value={maxPhotos} 
              onChange={(e) => setMaxPhotos(Number(e.target.value))}
              className="bg-transparent text-white border-none outline-none"
            >
              <option value={2} className="bg-gray-800">2 Photos</option>
              <option value={4} className="bg-gray-800">4 Photos</option>
              <option value={6} className="bg-gray-800">6 Photos</option>
              <option value={8} className="bg-gray-800">8 Photos</option>
            </select>
          </div>
          
          <button
            onClick={() => setUseTimer(!useTimer)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg backdrop-blur-sm transition-all duration-200 ${
              useTimer 
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            <Timer className="w-4 h-4" />
            <span>3s Timer</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6">
        {/* Camera Section */}
        <div className="flex-1">
          <CameraCapture
            onPhotoCapture={handlePhotoCapture}
            isCapturing={isCapturing}
            setIsCapturing={setIsCapturing}
            useTimer={useTimer}
            canCapture={canTakeMore}
          />
        </div>

        {/* Photos Section */}
        <div className="w-80">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 h-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">
                Photos ({photos.length}/{maxPhotos})
              </h3>
              {photos.length > 0 && (
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    photos.forEach((photo, index) => {
                      link.href = photo.dataUrl;
                      link.download = `photo-${index + 1}.png`;
                      link.click();
                    });
                  }}
                  className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm">Download All</span>
                </button>
              )}
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {photos.map((photo) => (
                <PhotoFrame
                  key={photo.id}
                  photo={photo}
                  onEdit={() => setSelectedPhoto(photo)}
                  onDelete={() => handleDeletePhoto(photo.id)}
                />
              ))}
            </div>

            {photos.length === 0 && (
              <div className="text-center text-gray-400 py-12">
                <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Start capturing memories!</p>
                <p className="text-sm mt-1">Photos must be even numbers</p>
              </div>
            )}

            {canComplete && (
              <button
                onClick={() => onPhotosComplete(photos)}
                className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-cyan-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Zap className="w-5 h-5" />
                <span>Create Collage</span>
              </button>
            )}

            {!isEvenNumber && photos.length > 0 && (
              <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-400 text-sm text-center">
                  Take {maxPhotos - photos.length} more photo{maxPhotos - photos.length !== 1 ? 's' : ''} to complete your set
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Photo Editor Modal */}
      {selectedPhoto && (
        <PhotoEditor
          photo={selectedPhoto}
          onSave={handlePhotoEdit}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
    </div>
  );
};

export default PhotoBooth;