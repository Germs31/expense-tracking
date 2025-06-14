import { useState } from 'react';
import Stepper from '../Stepper/Stepper';

interface SignupWizardProps {
  onComplete: () => void;
}

const SignupWizard: React.FC<SignupWizardProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    monthlyIncome: '',
    monthlyIncomeValue: 0
  });
  const [error, setError] = useState<string | null>(null);

  const steps = ["Basic Info", "Contact Details", "Confirmation"];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'monthlyIncome') {
      // Only allow numeric input (digits and decimal point)
      const numericValue = value.replace(/[^0-9.]/g, '');
      // Ensure only one decimal point
      const parts = numericValue.split('.');
      const formattedValue = parts.length > 1 
        ? `${parts[0]}.${parts.slice(1).join('')}` 
        : numericValue;
        
      setUserData(prev => ({
        ...prev,
        [name]: formattedValue,
        // Store as number in state for submission
        monthlyIncomeValue: parseFloat(formattedValue) || 0
      }));
    } else {
      setUserData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(curr => curr + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(curr => curr - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Create submission data with proper numeric value
    const submissionData = {
      ...userData,
      monthlyIncome: parseFloat(userData.monthlyIncome) || 0
    };
    
    try {
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });

      const result = await response.json();

      if (response.ok) {
        onComplete();
      } else {
        console.error('Failed to save user data:', result);
        setError(result.error || 'Failed to save user data');
      }
    } catch (error) {
      console.error('Error saving user data:', error);
      setError('An unexpected error occurred');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-white">Basic Information</h3>
            <div className="space-y-2">
              <label htmlFor="firstName" className="block text-sm font-medium text-white">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={userData.firstName}
                onChange={handleInputChange}
                className="w-full p-2 border rounded bg-neutral-700 text-white border-neutral-600 focus:ring focus:ring-emerald-500"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="block text-sm font-medium text-white">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={userData.lastName}
                onChange={handleInputChange}
                className="w-full p-2 border rounded bg-neutral-700 text-white border-neutral-600 focus:ring focus:ring-emerald-500"
                required
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-white">Contact Details</h3>
            <div className="space-y-2">
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-white">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={userData.phoneNumber}
                onChange={handleInputChange}
                className="w-full p-2 border rounded bg-neutral-700 text-white border-neutral-600 focus:ring focus:ring-emerald-500"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="address" className="block text-sm font-medium text-white">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={userData.address}
                onChange={handleInputChange}
                className="w-full p-2 border rounded bg-neutral-700 text-white border-neutral-600 focus:ring focus:ring-emerald-500"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="monthlyIncome" className="block text-sm font-medium text-white">Monthly Income</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">$</span>
                <input
                  type="text"
                  id="monthlyIncome"
                  name="monthlyIncome"
                  value={userData.monthlyIncome}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className="w-full pl-8 p-2 border rounded bg-neutral-700 text-white border-neutral-600 focus:ring focus:ring-emerald-500"
                  required
                  inputMode="decimal" // This brings up the numeric keyboard on mobile devices
                  onKeyPress={(e) => {
                    // Allow only numbers and decimal point
                    const isNumericOrDot = /^[0-9.]$/.test(e.key);
                    if (!isNumericOrDot) {
                      e.preventDefault();
                    }
                    // Prevent multiple decimal points
                    if (e.key === '.' && userData.monthlyIncome.includes('.')) {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-white">Confirm Your Information</h3>
            <div className="p-4 bg-neutral-700 rounded-lg text-white">
              <p><span className="font-bold">Name:</span> {userData.firstName} {userData.lastName}</p>
              <p><span className="font-bold">Phone:</span> {userData.phoneNumber}</p>
              <p><span className="font-bold">Address:</span> {userData.address}</p>
              <p><span className="font-bold">Monthly Income:</span> ${parseFloat(userData.monthlyIncome).toFixed(2)}</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-neutral-800 p-6 rounded-lg shadow-md border border-neutral-700">
      <h2 className="text-2xl font-bold text-center mb-6 text-white">Welcome to Expense Tracker</h2>
      <Stepper steps={steps} currentStep={currentStep} />
      
      {error && (
        <div className="bg-red-900/50 border border-red-500 text-white p-3 rounded mt-4 mb-2">
          {error}
        </div>
      )}
      
      <form onSubmit={currentStep === steps.length - 1 ? handleSubmit : undefined}>
        <div className="mt-6">
          {renderStepContent()}
        </div>
        
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`px-4 py-2 rounded ${
              currentStep === 0 
                ? 'bg-neutral-700 cursor-not-allowed' 
                : 'bg-neutral-600 hover:bg-neutral-500 text-white'
            }`}
          >
            Previous
          </button>
          
          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded"
            >
              Finish
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SignupWizard;