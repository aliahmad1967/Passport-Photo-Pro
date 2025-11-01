import React from 'react';
import { LightbulbIcon } from './Icon';

const Tips: React.FC = () => {
  return (
    <div className="bg-blue-50 dark:bg-gray-700/50 p-6 border-t border-blue-200 dark:border-gray-700">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <LightbulbIcon className="w-6 h-6 text-blue-500" />
        </div>
        <div className="ms-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Next Steps & Tips
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Use the <strong>"Prepare for Printing"</strong> option to arrange 6 photos on a 4x6" sheet, which is perfect for printing at home or at a photo center.</li>
            <li>When printing, use high-quality photo paper for the best results and ensure your printer is set to its highest quality setting.</li>
            <li>To use in a document, you can <strong>"Save as PDF"</strong> from the print menu, then insert the PDF or a screenshot into your Word file.</li>
            <li><strong>Important:</strong> Always double-check the latest photo requirements for your specific country or application before submitting.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Tips;