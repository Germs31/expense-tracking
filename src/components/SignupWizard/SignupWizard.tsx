import { useState } from 'react';
import Stepper from '../Stepper/Stepper';
import { signIn } from 'next-auth/react';

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
    monthlyIncomeValue: 0,
    email: '', // Added for password step
    password: '', // Added for password step
    confirmPassword: '' // Added for password step
  });
  const [error, setError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number;
    feedback: string[];
  }>({ score: 0, feedback: [] });

  // Expanded steps to include password creation
  const steps = ["Basic Info", "Password", "Contact Details", "Confirmation"];

  // Password validation rules
  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const feedback = [];
    if (!minLength) feedback.push("Password must be at least 8 characters long");
    if (!hasUpperCase) feedback.push("Include at least one uppercase letter");
    if (!hasLowerCase) feedback.push("Include at least one lowercase letter");
    if (!hasNumbers) feedback.push("Include at least one number");
    if (!hasSpecialChar) feedback.push("Include at least one special character");
    
    // Calculate password strength score (0-4)
    const valid = [minLength, hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean);
    const score = valid.length - 1; // 0-4 scale
    
    return { score, feedback };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
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
    } else if (name === 'password') {
      // Check password strength when password changes
      const strength = validatePassword(value);
      setPasswordStrength(strength);
      setUserData(prev => ({ ...prev, [name]: value }));
    } else {
      setUserData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleNext = () => {
    setError(null);
    
    // Validate based on current step
    if (currentStep === 1) {
      // Password validation
      if (userData.password !== userData.confirmPassword) {
        setError("Passwords don't match");
        return;
      }
      
      if (passwordStrength.score < 2) {
        setError("Please create a stronger password");
        return;
      }
    }
    
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
    
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: userData.email.toLowerCase(),
        password: userData.password,
        isRegistering: true, // Flag to indicate registration
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
        address: userData.address,
        monthlyIncome: userData.monthlyIncome,
        callbackUrl: '/'
      });

      console.log('Auth result:', result);

      if (result?.error) {
        throw new Error(result.error);
      }

      if (result?.ok) {
        onComplete();
      }

    } catch (error) {
      console.error('Registration/auth error:', error);
      setError(error.message || 'An error occurred');
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
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-white">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded bg-neutral-700 text-white border-neutral-600 focus:ring focus:ring-emerald-500"
                required
              />
            </div>
          </div>
        );
      case 1: // New Password step
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-white">Create Password</h3>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-white">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={userData.password}
                onChange={handleInputChange}
                className="w-full p-2 border rounded bg-neutral-700 text-white border-neutral-600 focus:ring focus:ring-emerald-500"
                required
              />
            </div>
            
            {/* Password strength indicator */}
            <div className="mt-2">
              <div className="flex space-x-1">
                {[1, 2, 3, 4].map((level) => (
                  <div 
                    key={level}
                    className={`h-2 flex-1 rounded ${
                      passwordStrength.score >= level 
                        ? level <= 1 
                          ? 'bg-red-500' 
                          : level <= 2 
                            ? 'bg-yellow-500' 
                            : level <= 3 
                              ? 'bg-emerald-500' 
                              : 'bg-emerald-500'
                        : 'bg-neutral-600'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs mt-1 text-neutral-400">
                {passwordStrength.score === 0 && "Very weak"}
                {passwordStrength.score === 1 && "Weak"}
                {passwordStrength.score === 2 && "Fair"}
                {passwordStrength.score === 3 && "Strong"}
                {passwordStrength.score === 4 && "Very strong"}
              </p>
            </div>
            
            {/* Password feedback tips */}
            {passwordStrength.feedback.length > 0 && (
              <div className="mt-2 p-3 bg-neutral-700 rounded-lg">
                <p className="text-sm text-white mb-1">Password requirements:</p>
                <ul className="list-disc pl-5 space-y-1">
                  {passwordStrength.feedback.map((tip, i) => (
                    <li key={i} className="text-xs text-neutral-400">{tip}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={userData.confirmPassword}
                onChange={handleInputChange}
                className="w-full p-2 border rounded bg-neutral-700 text-white border-neutral-600 focus:ring focus:ring-emerald-500"
                required
              />
            </div>
            
            {/* Password match indicator */}
            {userData.password && userData.confirmPassword && (
              <p className={`text-sm ${
                userData.password === userData.confirmPassword
                  ? 'text-emerald-500'
                  : 'text-red-500'
              }`}>
                {userData.password === userData.confirmPassword
                  ? '✓ Passwords match'
                  : '✗ Passwords don\'t match'}
              </p>
            )}
          </div>
        );
      case 2:
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
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-white">Confirm Your Information</h3>
            <div className="p-4 bg-neutral-700 rounded-lg text-white">
              <p><span className="font-bold">Name:</span> {userData.firstName} {userData.lastName}</p>
              <p><span className="font-bold">Email:</span> {userData.email}</p>
              <p><span className="font-bold">Phone:</span> {userData.phoneNumber}</p>
              <p><span className="font-bold">Address:</span> {userData.address}</p>
              <p><span className="font-bold">Monthly Income:</span> ${parseFloat(userData.monthlyIncome).toFixed(2)}</p>
              <p><span className="font-bold">Password:</span> ••••••••</p>
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
      
      <div className="bg-amber-900/50 border border-amber-500 text-white p-3 rounded mb-6">
        <p className="text-sm">
          <strong>Disclaimer:</strong> This is a portfolio project to demonstrate my development skills. 
          Please do not enter sensitive or real personal information as this application is for 
          demonstration purposes only.
        </p>
      </div>
      
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