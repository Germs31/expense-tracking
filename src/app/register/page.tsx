"use client";

import SignupWizard from "@/components/SignupWizard/SignupWizard";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const router = useRouter();
  
  const handleSignupComplete = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center px-4 py-10">
      <SignupWizard onComplete={handleSignupComplete} />
    </div>
  );
};

export default RegisterPage;