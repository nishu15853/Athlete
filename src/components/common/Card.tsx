import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'compact' | 'normal' | 'large';
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'compact',
  interactive = false,
}) => {
  const paddingClasses = {
    none: 'p-0',
    compact: 'p-3 sm:p-4',
    normal: 'p-4 sm:p-5',
    large: 'p-6 sm:p-8',
  };

  return (
    <div
      className={`bg-white rounded-2xl border border-gray-200/80 shadow-sm transition-all duration-200 ${
        paddingClasses[padding]
      } ${
        interactive ? 'hover:shadow-md hover:border-brand-cyan/40 hover:-translate-y-0.5 cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
