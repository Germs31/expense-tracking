import React from 'react'
import LogoutButton from './LogoutButton';

const Header = () => {
  return (
    <header className="bg-neutral-800 border-b border-neutral-700 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">Expense Tracker</h1>
        <LogoutButton />
      </div>
    </header>
  );
};

export default Header