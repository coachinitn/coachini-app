import React from 'react';
import { Check } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex items-center justify-center mb-6 sm:mb-8">
      <div className="flex items-center gap-1 sm:gap-2 w-full max-w-md">
        {/* Step 1 */}
        <div className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 ${
          currentStep >= 1
            ? 'bg-[#3A6FB6] border-[#3A6FB6] text-white'
            : 'border-[#3A6FB6] text-[#3A6FB6]'
        }`}>
          {currentStep > 1 ? (
            <Check className="w-4 h-4 sm:w-6 sm:h-6" />
          ) : (
            <span className="font-bold text-sm sm:text-base">1</span>
          )}
        </div>

        {/* Progress Line */}
        <div className={`flex-1 h-0.5 ${currentStep >= 2 ? 'bg-[#3A6FB6]' : 'bg-[#E6EDF6]'}`} />

        {/* Step 2 */}
        <div className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 ${
          currentStep >= 2
            ? 'bg-[#3A6FB6] border-[#3A6FB6] text-white'
            : 'border-[#3A6FB6] text-[#3A6FB6]'
        }`}>
          <span className="font-bold text-sm sm:text-base">2</span>
        </div>
      </div>
    </div>
  );
};
