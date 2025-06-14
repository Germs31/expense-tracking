
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthenticatedLayout from '@/components/Layout/AuthenticatedLayout';
import SignupWizard from '@/components/SignupWizard/SignupWizard';

interface WithAuthProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function withAuth<T>() {
  return function(Component: React.FC<T>) {
    return function WithAuthComponent(props: T) {
      const [isLoading, setIsLoading] = useState(true);
      const [hasUser, setHasUser] = useState(false);
      const router = useRouter();

      useEffect(() => {
        async function checkUser() {
          try {
            const res = await fetch('/api/user');
            const data = await res.json();
            
            if (data && data.user) {
              setHasUser(true);
            }
          } catch (error) {
            console.error('Auth check error:', error);
          } finally {
            setIsLoading(false);
          }
        }
        
        checkUser();
      }, []);

      if (isLoading) {
        return (
          <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
            <div className="text-emerald-500 text-2xl">Loading...</div>
          </div>
        );
      }

      if (!hasUser) {
        return (
          <div className="min-h-screen bg-neutral-900 flex items-center justify-center px-4 py-10">
            <SignupWizard onComplete={() => setHasUser(true)} />
          </div>
        );
      }

      return (
        <AuthenticatedLayout>
          <Component {...props} />
        </AuthenticatedLayout>
      );
    };
  };
}