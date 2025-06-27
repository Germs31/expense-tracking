import React from 'react';
import SideBar from '../Sidebar/SideBar';
import Header from '../Header/Header';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen w-screen">
      {/* Sidebar */}
      <SideBar />
      
      {/* Main Content */}
      <div className="h-full w-full flex flex-col bg-neutral-900">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;