import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  pulse?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'cyan',
  size = 'md',
  icon,
  pulse = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  const variantClasses = {
    cyan: 'bg-brand-cyan/20 text-brand-deepGreen border border-brand-cyan/30',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200',
    neutral: 'bg-gray-100 text-gray-700 border border-gray-200',
  };

  return (
    <span
      className={`inline-flex items-center font-bold rounded-full uppercase tracking-wider ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {pulse && (
        <span
          className={`w-1.5 h-1.5 rounded-full animate-ping mr-0.5 ${
            variant === 'success'
              ? 'bg-emerald-500'
              : variant === 'danger'
              ? 'bg-rose-500'
              : 'bg-brand-cyan'
          }`}
        />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
