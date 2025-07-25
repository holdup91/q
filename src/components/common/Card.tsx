import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  shadow?: 'sm' | 'md' | 'lg';
  padding?: 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  onClick,
  shadow = 'md',
  padding = 'md'
}) => {
  const shadowClass = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  }[shadow];

  const paddingClass = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  }[padding];

  return (
    <div 
      className={`bg-white rounded-xl ${shadowClass} ${paddingClass} transition-all duration-200 border border-gray-100 ${onClick ? 'cursor-pointer hover:shadow-lg hover:border-gray-200' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};