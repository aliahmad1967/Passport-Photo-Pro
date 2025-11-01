import React from 'react';
import { CameraIcon } from './Icon';

const Header: React.FC = () => {
  return (
    <header className="w-full bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <CameraIcon className="w-8 h-8 text-blue-600 dark:text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Passport Photo Pro
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;