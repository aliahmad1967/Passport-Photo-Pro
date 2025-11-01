import React, { useState, useCallback, useRef } from 'react';
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
  type PixelCrop,
} from 'react-image-crop';
import { generatePassportPhoto } from './services/geminiService';
import { applyEditsAndGetBase64, getCroppedImg } from './utils/fileUtils';
import { AppStatus } from './types';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import Spinner from './components/Spinner';
import PrintView from './components/PrintView';
import Tips from './components/Tips';
import CameraView from './components/CameraView';
import { CameraIcon, LockClosedIcon, LockOpenIcon } from './components/Icon';
import ImageEditor from './components/ImageEditor';

interface Edits {
  brightness: number;
  contrast: number;
  saturation: number;
}

const initialEdits: Edits = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
};

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalImagePreview, setOriginalImagePreview] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  
  // Edit history state
  const [history, setHistory] = useState<Edits[]>([initialEdits]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const edits = history[historyIndex];
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // Cropping state
  const imgRef = useRef<HTMLImageElement>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [isAspectLocked, setIsAspectLocked] = useState(true);

  const resetHistoryAndEdits = () => {
    setHistory([initialEdits]);
    setHistoryIndex(0);
  };

  const handleEditsChange = (newEdits: Partial<Edits>) => {
    const currentEdits = history[historyIndex];
    const updatedEdits = { ...currentEdits, ...newEdits };
    const newHistory = history.slice(0, historyIndex + 1);
    setHistory([...newHistory, updatedEdits]);
    setHistoryIndex(newHistory.length);
  };
  
  const handleUndo = () => {
    if (canUndo) {
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (canRedo) {
      setHistoryIndex(historyIndex + 1);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setOriginalImage(file);
        setOriginalImagePreview(URL.createObjectURL(file));
        setProcessedImage(null);
        setStatus(AppStatus.IDLE);
        setError(null);
        resetHistoryAndEdits();
      } else {
        setError("Please upload a valid image file (e.g., JPG, PNG).");
        setOriginalImage(null);
        setOriginalImagePreview(null);
        resetHistoryAndEdits();
      }
    }
  };

  const handleCapture = (file: File) => {
    if (file) {
      setOriginalImage(file);
      setOriginalImagePreview(URL.createObjectURL(file));
      setProcessedImage(null);
      setStatus(AppStatus.IDLE);
      setError(null);
      setIsCameraOpen(false);
      resetHistoryAndEdits();
    }
  };

  const handleGenerateClick = useCallback(async () => {
    if (!originalImage) {
      setError("Please upload an image first.");
      return;
    }

    setStatus(AppStatus.LOADING);
    setError(null);
    setProcessedImage(null);

    try {
      const base64Data = await applyEditsAndGetBase64(originalImage, edits);
      const result = await generatePassportPhoto(base64Data, originalImage.type);
      setProcessedImage(`data:${originalImage.type};base64,${result}`);
      setStatus(AppStatus.SUCCESS);
    } catch (err) {
      console.error(err);
      setError("Failed to generate passport photo. Please try again.");
      setStatus(AppStatus.ERROR);
    }
  }, [originalImage, edits]);

  const handleReset = () => {
    setOriginalImage(null);
    if (originalImagePreview) {
      URL.revokeObjectURL(originalImagePreview);
    }
    setOriginalImagePreview(null);
    setProcessedImage(null);
    setStatus(AppStatus.IDLE);
    setError(null);
    setIsPrinting(false);
    setIsCameraOpen(false);
    setIsCropping(false);
    resetHistoryAndEdits();
  };

  const onCropStart = () => {
    setIsCropping(true);
    setIsAspectLocked(true); // Default to locked aspect ratio
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      const newCrop = centerCrop(
        makeAspectCrop(
          {
            unit: '%',
            width: 90,
          },
          3 / 4, // aspect ratio
          width,
          height
        ),
        width,
        height
      );
      setCrop(newCrop);
    }
  };

  const handleApplyCrop = useCallback(async () => {
    if (!completedCrop || !originalImagePreview || !originalImage) {
      return;
    }
    try {
      const croppedFile = await getCroppedImg(
        originalImagePreview,
        completedCrop,
        originalImage.name
      );
      
      URL.revokeObjectURL(originalImagePreview); // Clean up old URL

      setOriginalImage(croppedFile);
      setOriginalImagePreview(URL.createObjectURL(croppedFile));
      
      setIsCropping(false);
      setCrop(undefined);
      setCompletedCrop(undefined);
      resetHistoryAndEdits();

    } catch (e) {
      console.error(e);
      setError("Failed to crop the image. Please try again.");
      setIsCropping(false);
    }
  }, [completedCrop, originalImagePreview, originalImage]);
  
  const handleCancelCrop = () => {
    setIsCropping(false);
    setCrop(undefined);
    setCompletedCrop(undefined);
  };


  if (isPrinting && processedImage) {
    return <PrintView imageUrl={processedImage} onBack={() => setIsPrinting(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center antialiased text-gray-800 dark:text-gray-200 selection:bg-blue-500/20">
      <Header />
      <main className="container mx-auto p-4 md:p-8 flex-grow w-full max-w-4xl">
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden">
          <div className="p-6 md:p-10">
            {isCameraOpen ? (
              <CameraView onCapture={handleCapture} onCancel={() => setIsCameraOpen(false)} />
            ) : (
              <>
                <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
                  Create Your Perfect Passport Photo
                </h2>
                <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                  Upload a photo or take a selfie, and our AI will prepare it to meet standard passport requirements.
                </p>
                
                {!originalImagePreview && (
                   <div className="flex flex-col items-center space-y-6">
                    <ImageUploader onChange={handleFileChange} />
                    <div className="flex items-center w-full max-w-sm">
                      <hr className="w-full border-t border-gray-300 dark:border-gray-600" />
                      <span className="px-4 text-sm font-medium text-gray-500 dark:text-gray-400">OR</span>
                      <hr className="w-full border-t border-gray-300 dark:border-gray-600" />
                    </div>
                    <button
                      onClick={() => setIsCameraOpen(true)}
                      className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 font-bold text-white bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 transition-transform transform hover:scale-105"
                    >
                      <CameraIcon className="w-6 h-6 me-3" />
                      Take a Selfie
                    </button>
                  </div>
                )}
           
                {error && (
                  <div className="mt-4 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                  </div>
                )}
                
                <div className={`transition-all duration-500 ease-in-out grid gap-8 ${originalImagePreview ? 'grid-cols-1 md:grid-cols-2 mt-8' : 'grid-cols-1'}`}>
                  {originalImagePreview && (
                    <div className="flex flex-col items-center">
                      <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">Original Image</h3>
                      <div className="w-full max-w-xs">
                        {isCropping ? (
                           <ReactCrop
                            crop={crop}
                            onChange={(_, percentCrop) => setCrop(percentCrop)}
                            onComplete={(c) => setCompletedCrop(c)}
                            aspect={isAspectLocked ? 3 / 4 : undefined}
                            minWidth={100}
                          >
                             <img 
                              ref={imgRef}
                              src={originalImagePreview} 
                              alt="Original upload" 
                              className="rounded-lg shadow-md w-full object-contain"
                            />
                          </ReactCrop>
                        ) : (
                          <img 
                            ref={imgRef}
                            src={originalImagePreview} 
                            alt="Original upload" 
                            className="rounded-lg shadow-md w-full object-contain"
                            style={{ filter: `brightness(${edits.brightness}%) contrast(${edits.contrast}%) saturate(${edits.saturation}%)` }}
                          />
                        )}
                      </div>

                      {status !== AppStatus.SUCCESS && (
                        <div className="w-full max-w-xs">
                          {!isCropping ? (
                            <ImageEditor
                              edits={edits}
                              onChange={handleEditsChange}
                              onReset={resetHistoryAndEdits}
                              onCropStart={onCropStart}
                              onUndo={handleUndo}
                              onRedo={handleRedo}
                              canUndo={canUndo}
                              canRedo={canRedo}
                            />
                          ) : (
                             <div className="mt-6 flex justify-center items-center gap-4 w-full">
                                <button
                                  onClick={handleCancelCrop}
                                  className="px-6 py-2 font-semibold text-gray-700 bg-gray-200 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => setIsAspectLocked(prev => !prev)}
                                  title={isAspectLocked ? "Unlock Aspect Ratio" : "Lock to Passport Ratio (3:4)"}
                                  className="p-2 text-gray-600 bg-gray-200 dark:bg-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  {isAspectLocked ? <LockClosedIcon className="w-5 h-5" /> : <LockOpenIcon className="w-5 h-5" />}
                                </button>
                                <button
                                  onClick={handleApplyCrop}
                                  className="px-6 py-2 font-bold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition"
                                >
                                  Apply Crop
                                </button>
                              </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                   {status === AppStatus.LOADING && (
                      <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/50 rounded-lg p-8">
                        <Spinner />
                        <p className="mt-4 text-gray-600 dark:text-gray-400 animate-pulse">Generating your photo...</p>
                      </div>
                    )}

                  {status === AppStatus.SUCCESS && processedImage && (
                    <ResultDisplay imageUrl={processedImage} onPrint={() => setIsPrinting(true)} />
                  )}
                </div>

                {originalImagePreview && status !== AppStatus.SUCCESS && !isCropping && (
                  <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
                     <button
                      onClick={handleGenerateClick}
                      disabled={status === AppStatus.LOADING}
                      className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 font-bold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 disabled:bg-blue-400 dark:disabled:bg-blue-800 disabled:cursor-not-allowed transition-transform transform hover:scale-105"
                    >
                      {status === AppStatus.LOADING ? 'Generating...' : 'Generate Passport Photo'}
                    </button>
                     <button
                      onClick={handleReset}
                      className="w-full sm:w-auto px-6 py-3 font-semibold text-gray-700 bg-gray-200 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 transition"
                    >
                      Use a different photo
                    </button>
                  </div>
                )}
                 {status === AppStatus.SUCCESS && (
                    <div className="mt-10 text-center">
                        <button
                            onClick={handleReset}
                            className="px-8 py-3 font-semibold text-gray-700 bg-gray-200 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 transition"
                        >
                            Start Over
                        </button>
                    </div>
                )}
              </>
            )}
          </div>
          {status === AppStatus.SUCCESS && !isCameraOpen && <Tips />}
        </div>
        <footer className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
          <p>
            © {new Date().getFullYear()} Passport Photo Pro. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default App;