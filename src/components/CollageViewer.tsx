import React, { useState } from 'react';
import { ArrowLeft, Download, Grid, Printer } from 'lucide-react';
import { Photo, CollageLayout, COLLAGE_LAYOUTS } from '../types';
import CollageCreator from './CollageCreator';

interface CollageViewerProps {
  photos: Photo[];
  onBack: () => void;
}

const CollageViewer: React.FC<CollageViewerProps> = ({ photos, onBack }) => {
  const [selectedLayout, setSelectedLayout] = useState<CollageLayout>(COLLAGE_LAYOUTS[0]);
  const [collageDataUrl, setCollageDataUrl] = useState<string>('');

  const handleDownloadCollage = () => {
    if (collageDataUrl) {
      const link = document.createElement('a');
      link.href = collageDataUrl;
      link.download = `collage-${selectedLayout.id}-${Date.now()}.png`;
      link.click();
    }
  };

  const handlePrintCollage = () => {
    if (collageDataUrl) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head><title>Photo Collage</title></head>
            <body style="margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh;">
              <img src="${collageDataUrl}" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Photobooth</span>
        </button>

        <div className="flex items-center space-x-3">
          <Grid className="w-6 h-6 text-cyan-400" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
            Create Your Collage
          </h1>
        </div>

        <div className="flex space-x-2">
          {collageDataUrl && (
            <>
              <button
                onClick={handlePrintCollage}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
              <button
                onClick={handleDownloadCollage}
                className="flex items-center space-x-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Layout Selection */}
        <div className="lg:col-span-1">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Choose Layout</h3>
            <div className="space-y-3">
              {COLLAGE_LAYOUTS.map((layout) => (
                <button
                  key={layout.id}
                  onClick={() => setSelectedLayout(layout)}
                  className={`w-full p-4 rounded-lg text-left transition-all duration-200 ${
                    selectedLayout.id === layout.id
                      ? 'bg-gradient-to-r from-cyan-500/20 to-pink-500/20 border border-cyan-500/30 text-white'
                      : 'bg-white/5 hover:bg-white/10 text-gray-300'
                  }`}
                >
                  <div className="font-medium">{layout.name}</div>
                  <div className="text-sm opacity-70">
                    {layout.rows} × {layout.cols} grid
                  </div>
                </button>
              ))}
            </div>

            {/* Photo Count Info */}
            <div className="mt-6 p-4 bg-white/5 rounded-lg">
              <h4 className="font-medium text-white mb-2">Your Photos</h4>
              <p className="text-gray-300 text-sm">
                {photos.length} photos captured
              </p>
              <p className="text-cyan-400 text-sm">
                Perfect for {selectedLayout.rows}×{selectedLayout.cols} layout!
              </p>
            </div>
          </div>
        </div>

        {/* Collage Preview */}
        <div className="lg:col-span-3">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">
                {selectedLayout.name} Preview
              </h3>
              <div className="text-sm text-gray-400">
                {photos.length} photos • {selectedLayout.rows}×{selectedLayout.cols} grid
              </div>
            </div>

            <CollageCreator
              photos={photos}
              layout={selectedLayout}
              onCollageGenerated={setCollageDataUrl}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollageViewer;