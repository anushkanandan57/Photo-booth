import React, { useRef, useEffect, useState } from 'react';
import { Camera, Circle } from 'lucide-react';

interface CameraCaptureProps {
  onPhotoCapture: (dataUrl: string) => void;
  isCapturing: boolean;
  setIsCapturing: (capturing: boolean) => void;
  useTimer: boolean;
  canCapture: boolean;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({
  onPhotoCapture,
  isCapturing,
  setIsCapturing,
  useTimer,
  canCapture
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user'
          }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          setStream(mediaStream);
          setIsReady(true);
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current || !canCapture) return;

    setIsCapturing(true);

    if (useTimer) {
      setCountdown(3);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            takePhoto();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      takePhoto();
    }
  };

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    if (context) {
      // Flip the image horizontally for mirror effect
      context.scale(-1, 1);
      context.translate(-canvas.width, 0);
      context.drawImage(video, 0, 0);
      
      const dataUrl = canvas.toDataURL('image/png', 0.95);
      onPhotoCapture(dataUrl);
    }
  };

  return (
    <div className="relative">
      <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-auto max-h-[70vh] object-cover scale-x-[-1]"
        />
        
        {/* Countdown Overlay */}
        {countdown > 0 && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="text-8xl font-bold text-white animate-pulse">
              {countdown}
            </div>
          </div>
        )}

        {/* Camera Flash Effect */}
        {isCapturing && countdown === 0 && (
          <div className="absolute inset-0 bg-white animate-pulse" 
               style={{ animationDuration: '0.2s' }} />
        )}

        {/* Camera Controls Overlay */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
          <button
            onClick={capturePhoto}
            disabled={!isReady || !canCapture || isCapturing}
            className={`relative w-20 h-20 rounded-full border-4 border-white/80 backdrop-blur-sm transition-all duration-200 ${
              canCapture && !isCapturing
                ? 'bg-white/20 hover:bg-white/30 hover:scale-110 active:scale-95' 
                : 'bg-white/10 cursor-not-allowed opacity-50'
            }`}
          >
            <div className={`absolute inset-2 rounded-full transition-all duration-200 ${
              canCapture && !isCapturing
                ? 'bg-white hover:bg-gradient-to-r hover:from-cyan-400 hover:to-pink-500'
                : 'bg-gray-400'
            }`}>
              {isCapturing ? (
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-pink-500 animate-pulse" />
              ) : (
                <Camera className="w-6 h-6 text-gray-800 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              )}
            </div>
          </button>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
      
      {!canCapture && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl flex items-center justify-center">
          <div className="text-center text-white">
            <Circle className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-xl font-semibold">Photo limit reached</p>
            <p className="text-gray-300">Complete your session or start over</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;