import React from 'react';
import { CropIcon, UndoIcon, RedoIcon } from './Icon';

interface Edits {
  brightness: number;
  contrast: number;
  saturation: number;
}

interface ImageEditorProps {
  edits: Edits;
  onChange: (newEdits: Partial<Edits>) => void;
  onReset: () => void;
  onCropStart: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const Slider: React.FC<{
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ label, value, onChange }) => (
  <div className="w-full">
    <label htmlFor={label} className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
      {label} ({value}%)
    </label>
    <input
      id={label}
      type="range"
      min="0"
      max="200"
      value={value}
      onChange={onChange}
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
    />
  </div>
);

const ImageEditor: React.FC<ImageEditorProps> = ({ 
  edits, 
  onChange, 
  onReset, 
  onCropStart,
  onUndo,
  onRedo,
  canUndo,
  canRedo
}) => {
  return (
    <div className="w-full max-w-xs mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-4 border border-gray-200 dark:border-gray-700">
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onCropStart}
          className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 dark:bg-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:focus:ring-offset-gray-800"
        >
          <CropIcon className="w-4 h-4 me-2" />
          Crop
        </button>
         <button
          onClick={onReset}
          className="w-full px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 dark:bg-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:focus:ring-offset-gray-800"
        >
          Reset
        </button>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-600"></div>
      <div className="flex items-center justify-between">
        <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200">Adjust Photo</h4>
        <div className="flex items-center gap-2">
           <button 
            onClick={onUndo} 
            disabled={!canUndo}
            title="Undo"
            className="p-1 text-gray-600 bg-gray-200 rounded-full dark:bg-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <UndoIcon className="w-4 h-4" />
          </button>
          <button 
            onClick={onRedo} 
            disabled={!canRedo}
            title="Redo"
            className="p-1 text-gray-600 bg-gray-200 rounded-full dark:bg-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <RedoIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      <Slider
        label="Brightness"
        value={edits.brightness}
        onChange={(e) => onChange({ brightness: parseInt(e.target.value) })}
      />
      <Slider
        label="Contrast"
        value={edits.contrast}
        onChange={(e) => onChange({ contrast: parseInt(e.target.value) })}
      />
      <Slider
        label="Saturation"
        value={edits.saturation}
        onChange={(e) => onChange({ saturation: parseInt(e.target.value) })}
      />
    </div>
  );
};

export default ImageEditor;