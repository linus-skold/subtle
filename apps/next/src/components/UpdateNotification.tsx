import React, { useState, useEffect } from 'react';
import { ArrowDownTrayIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface UpdateNotificationProps {
  show: boolean;
  onClose: () => void;
  onInstall: () => void;
  currentVersion?: string;
  newVersion?: string;
}

const UpdateNotification: React.FC<UpdateNotificationProps> = ({ 
  show, 
  onClose, 
  onInstall, 
  currentVersion, 
  newVersion 
}) => {
  if (!show) return null;

  return (
    <div className="fixed top-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
          <div>
            <h4 className="font-semibold">Update Available</h4>
            <p className="text-sm opacity-90">
              {newVersion ? `Version ${newVersion} is ready to install.` : 'A new version of Subtle is ready to install.'}
            </p>
            {currentVersion && (
              <p className="text-xs opacity-75">Current: v{currentVersion}</p>
            )}
          </div>
        </div>
        <button onClick={onClose} className="ml-2">
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-3 flex space-x-2">
        <button
          onClick={onInstall}
          className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100"
        >
          Install & Restart
        </button>
        <button
          onClick={onClose}
          className="bg-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-800"
        >
          Later
        </button>
      </div>
    </div>
  );
};

export default UpdateNotification;