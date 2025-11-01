
import React from 'react';
import { DownloadIcon, PrintIcon } from './Icon';

interface ResultDisplayProps {
  imageUrl: string;
  onPrint: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ imageUrl, onPrint }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'passport-photo.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center space-y-6">
       <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Generated Photo</h3>
      <img src={imageUrl} alt="Processed passport" className="rounded-lg shadow-lg w-full max-w-xs object-contain" />
      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
        <button
          onClick={handleDownload}
          className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800 transition-transform transform hover:scale-105"
        >
          <DownloadIcon className="w-5 h-5 mr-2" />
          Download Photo
        </button>
        <button
          onClick={onPrint}
          className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 font-semibold text-white bg-sky-600 rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-300 dark:focus:ring-sky-800 transition-transform transform hover:scale-105"
        >
          <PrintIcon className="w-5 h-5 mr-2" />
          Prepare for Printing
        </button>
      </div>
    </div>
  );
};

export default ResultDisplay;
