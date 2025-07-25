import React from 'react';

interface XPProgressProps {
  currentXP: number;
  maxXP: number;
  level: number;
  className?: string;
}

export const XPProgress: React.FC<XPProgressProps> = ({
  currentXP,
  maxXP,
  level,
  className = ''
}) => {
  const progressPercentage = (currentXP / maxXP) * 100;

  return (
    <div className={`bg-white rounded-xl p-4 shadow-md ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Level {level}</span>
        <span className="text-sm text-gray-500">{currentXP}/{maxXP} XP</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className="bg-gradient-to-r from-coral to-teal h-3 rounded-full transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};