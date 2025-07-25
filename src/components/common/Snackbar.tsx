import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

interface SnackbarProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export const Snackbar: React.FC<SnackbarProps> = ({
  message,
  type = 'info',
  isVisible,
  onClose,
  duration = 4000
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const typeStyles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-teal text-white'
  }[type];

  const Icon = {
    success: CheckCircle,
    error: AlertCircle,
    info: CheckCircle
  }[type];

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 flex justify-center">
      <div className={`${typeStyles} rounded-xl px-4 py-3 shadow-lg flex items-center space-x-3 max-w-sm w-full`}>
        <Icon size={20} />
        <span className="flex-1 text-sm font-medium">{message}</span>
        <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};