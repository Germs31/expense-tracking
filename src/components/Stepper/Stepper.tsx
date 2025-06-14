import React from 'react';

interface StepperProps {
  steps: string[];
  currentStep: number;
  onComplete?: () => void;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between mb-2">
        {steps.map((step, i) => (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center">
              <div 
                className={`w-10 h-10 flex items-center justify-center rounded-full ${
                  i < currentStep 
                    ? 'bg-emerald-600' 
                    : i === currentStep 
                    ? 'bg-emerald-500' 
                    : 'bg-neutral-600'
                } text-white font-bold`}
              >
                {i + 1}
              </div>
              <div className="text-xs mt-2 text-center text-white">{step}</div>
            </div>
            {i < steps.length - 1 && (
              <div 
                className={`flex-1 h-1 mx-2 ${
                  i < currentStep ? 'bg-emerald-600' : 'bg-neutral-600'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Stepper;