"use client";

import { useEffect, useState } from 'react';
import { Edit2, Save } from 'lucide-react';
import { withAuth } from '@/app/_common';

interface User {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  monthlyIncome: number;
  createdAt?: string;
  lastUpdated?: string;
}

function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editableUser, setEditableUser] = useState<User>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    monthlyIncome: 0
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/user');
        const data = await res.json();
        
        if (data && data.user) {
          setUser(data.user);
          setEditableUser(data.user);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user:', error);
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    // Convert numeric inputs to numbers
    const finalValue = type === 'number' 
      ? parseFloat(value) || 0 
      : value;
    
    setEditableUser(prev => ({
      ...prev,
      [name]: finalValue
    }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editableUser),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        setIsEditing(false);
      } else {
        console.error('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-neutral-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-0 px-4 py-8 sm:px-6 lg:px-8">
      {/* Profile header card */}
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-2xl shadow-lg overflow-hidden relative">
        {/* Edit button as icon in top right */}
        <button 
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors border border-white/10"
          aria-label={isEditing ? "Save profile" : "Edit profile"}
        >
          {isEditing ? <Save size={18} /> : <Edit2 size={18} />}
        </button>

        <div className="p-6 flex flex-col items-start gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-black/20 flex items-center justify-center text-white text-3xl font-bold shadow-md">
            {user?.firstName?.charAt(0) || ''}
            {user?.lastName?.charAt(0) || ''}
          </div>
          
          <div className="flex-1">
            {isEditing ? (
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={editableUser.firstName}
                  onChange={handleInputChange}
                  className="w-full text-xl font-bold bg-black/10 text-white rounded-md px-3 py-2 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={editableUser.lastName}
                  onChange={handleInputChange}
                  className="w-full text-xl font-bold bg-black/10 text-white rounded-md px-3 py-2 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>
            ) : (
              <h1 className="text-2xl font-bold text-white">{`${user?.firstName || ''} ${user?.lastName || ''}`}</h1>
            )}
            <p className="text-emerald-100 mt-1">User Profile</p>
            
            {/* Metadata */}
            <div className="mt-4 flex flex-col gap-2 text-xs text-emerald-100">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Joined: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Last updated: {user?.lastUpdated ? new Date(user.lastUpdated).toLocaleDateString() : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* User details */}
      <div className="mt-8">
        <h2 className="text-xl font-medium text-white mb-4">Personal Information</h2>
        <div className="flex flex-col gap-4">
          <div className="bg-neutral-800 rounded-xl shadow p-6">
            <h3 className="font-medium text-white flex items-center gap-2 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Phone Number
            </h3>
            {isEditing ? (
              <input
                type="text"
                name="phoneNumber"
                placeholder="Enter phone number"
                value={editableUser.phoneNumber}
                onChange={handleInputChange}
                className="bg-neutral-700 text-white rounded-md px-3 py-2 border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full"
              />
            ) : (
              <p className="text-neutral-400 text-lg">{user?.phoneNumber || 'Not provided'}</p>
            )}
          </div>
          
          <div className="bg-neutral-800 rounded-xl shadow p-6">
            <h3 className="font-medium text-white flex items-center gap-2 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Address
            </h3>
            {isEditing ? (
              <input
                type="text"
                name="address"
                placeholder="Enter address"
                value={editableUser.address}
                onChange={handleInputChange}
                className="bg-neutral-700 text-white rounded-md px-3 py-2 border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full"
              />
            ) : (
              <p className="text-neutral-400 text-lg">{user?.address || 'Not provided'}</p>
            )}
          </div>
          
          <div className="bg-neutral-800 rounded-xl shadow p-6">
            <h3 className="font-medium text-white flex items-center gap-2 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Monthly Income
            </h3>
            {isEditing ? (
              <input
                type="number"
                name="monthlyIncome"
                placeholder="Enter monthly income"
                value={editableUser.monthlyIncome}
                onChange={handleInputChange}
                className="bg-neutral-700 text-white rounded-md px-3 py-2 border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full"
              />
            ) : (
              <p className="text-neutral-400 text-lg">
                {typeof user?.monthlyIncome === 'number' 
                  ? `$${user.monthlyIncome.toFixed(2)}` 
                  : '$0.00'}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Bottom action buttons for mobile (when editing) */}
      {isEditing && (
        <div className="mt-6">
          <button
            onClick={handleSave}
            className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-md text-sm font-medium transition-colors w-full"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}

export default withAuth()(UserProfile);
