import React, { useState } from 'react';
import PhotoBooth from './components/PhotoBooth';
import CollageViewer from './components/CollageViewer';
import { Photo } from './types';

function App() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [currentView, setCurrentView] = useState<'photobooth' | 'collage'>('photobooth');

  const handlePhotosComplete = (capturedPhotos: Photo[]) => {
    setPhotos(capturedPhotos);
    setCurrentView('collage');
  };

  const handleBackToPhotobooth = () => {
    setCurrentView('photobooth');
    setPhotos([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black">
      {currentView === 'photobooth' ? (
        <PhotoBooth onPhotosComplete={handlePhotosComplete} />
      ) : (
        <CollageViewer 
          photos={photos} 
          onBack={handleBackToPhotobooth}
        />
      )}
    </div>
  );
}

export default App;