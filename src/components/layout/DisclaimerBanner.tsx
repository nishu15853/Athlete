import React from 'react';
import { AlertCircle } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <div className="bg-brand-deepGreen text-white text-xs py-2 px-4 flex items-center justify-center space-x-2 border-b border-brand-cyan/20">
      <AlertCircle className="w-4 h-4 text-brand-cyan shrink-0" />
      <span>
        <strong className="font-semibold text-brand-cyan">IMPORTANT DISCLAIMER:</strong> This application provides wellness and biomechanical insights only and is not a medical diagnosis.
      </span>
    </div>
  );
};
