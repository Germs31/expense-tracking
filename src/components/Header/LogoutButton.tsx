
'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

const LogoutButton = () => {
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <button 
      onClick={handleLogout}
      className="flex items-center space-x-2 text-gray-300 hover:text-white"
    >
      <LogOut size={18} />
      <span>Logout</span>
    </button>
  );
};

export default LogoutButton;