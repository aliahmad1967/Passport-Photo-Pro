
import React from 'react';
import { PrintIcon } from './Icon';

interface PrintViewProps {
  imageUrl: string;
  onBack: () => void;
}

const PrintView: React.FC<PrintViewProps> = ({ imageUrl, onBack }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          .no-print {
            display: none !important;
          }
          .print-area {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .print-sheet-4x6 {
            width: 6in;
            height: 4in;
            box-shadow: none;
            margin: 0;
            border: none;
          }
        }
      `}</style>
      <div className="min-h-screen bg-gray-200 dark:bg-gray-900 flex flex-col items-center p-4">
        <header className="no-print w-full max-w-5xl bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-8 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">Print Preview</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="px-4 py-2 font-semibold text-gray-700 bg-gray-200 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              Back to Editor
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center justify-center px-5 py-2 font-bold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition"
            >
              <PrintIcon className="w-5 h-5 mr-2" />
              Print
            </button>
          </div>
        </header>

        <main className="print-area">
          <div
            className="print-sheet-4x6 bg-white grid grid-cols-3 grid-rows-2 gap-0 shadow-2xl"
            style={{ width: '6in', height: '4in' }}
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="w-[2in] h-[2in] p-1 box-border">
                <img
                  src={imageUrl}
                  alt={`Passport Photo ${index + 1}`}
                  className="w-full h-full object-cover border border-dashed border-gray-300"
                />
              </div>
            ))}
          </div>
        </main>
        
        <div className="no-print mt-8 text-center text-gray-600 dark:text-gray-400 max-w-2xl">
            <p className="font-semibold">Printing Instructions:</p>
            <p>1. Click the "Print" button to open the print dialog.</p>
            <p>2. Set Paper Size to <strong>4x6 in</strong> or <strong>10x15 cm</strong>.</p>
            <p>3. Ensure 'Scale' is set to <strong>100%</strong> or <strong>'Actual Size'</strong>.</p>
            <p>4. To save as a PDF, choose "Save as PDF" as the destination printer.</p>
        </div>
      </div>
    </>
  );
};

export default PrintView;
