
import React, { useRef, useEffect, useState } from 'react';
import { CameraIcon, CrossIcon } from './Icon';

interface CameraViewProps {
  onCapture: (file: File) => void;
  onCancel: () => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }
      } catch (err) {
        console.error("Error accessing camera: ", err);
        setError("Could not access the camera. Please check your browser permissions.");
        onCancel(); // Automatically go back if camera fails
      }
    };

    startCamera();

    return () => {
      // Cleanup: stop the stream when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [onCancel]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext('2d');
      if (context) {
        // Flip the context horizontally to correctly capture the mirrored selfie view
        context.translate(video.videoWidth, 0);
        context.scale(-1, 1);
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        
        canvas.toBlob(blob => {
          if (blob) {
            const file = new File([blob], 'selfie.png', { type: 'image/png' });
            onCapture(file);
          }
        }, 'image/png', 0.95);
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <h3 className="text-xl font-semibold mb-4 text-center text-gray-900 dark:text-white">
        Position Your Face in the Oval
      </h3>
      <div className="relative w-full max-w-lg bg-black rounded-lg overflow-hidden shadow-lg aspect-[4/3]">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted
          className="w-full h-full object-cover transform scale-x-[-1]"
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[60%] h-[80%] border-4 border-dashed border-white/50 rounded-[50%]"></div>
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </div>
      
      <div className="mt-6 flex justify-center gap-4 w-full">
        <button
          onClick={onCancel}
          className="inline-flex items-center justify-center px-6 py-3 font-semibold text-gray-700 bg-gray-200 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 transition"
        >
          <CrossIcon className="w-5 h-5 mr-2" />
          Cancel
        </button>
        <button
          onClick={handleCapture}
          className="inline-flex items-center justify-center px-8 py-3 font-bold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition-transform transform hover:scale-105"
        >
          <CameraIcon className="w-6 h-6 mr-2" />
          Snap Photo
        </button>
      </div>
    </div>
  );
};

export default CameraView;
