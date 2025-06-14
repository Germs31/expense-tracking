
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
      <div className="h-full w-full bg-black">
        <Header />
        <main>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;