'use client';

import { useState, useEffect } from 'react';
import { UserCircle, Save, X } from 'lucide-react';

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    _id: "",
    firstName: "Hello",
    lastName: "World",
    address: "123 Main Street, Apt 4B, New York, NY 10001",
    phoneNumber: "(555) 123-4567",
    monthlyIncome: "$5,200"
  });
  
  const [editableUser, setEditableUser] = useState({...user});

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const response = await fetch('/api/user');
    console.log(response)
    const data = await response.json();
    setUser(data.user);
    setEditableUser(data.user);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    setUser(editableUser);
    setIsEditing(false);
    saveData();
  };
  const saveData = async () => {
    await fetch('/api/user', {
      method: 'PUT',
      body: JSON.stringify({_id: user._id, ...editableUser})
    });
  };

  const handleCancel = () => {
    setEditableUser({...user});
    setIsEditing(false);
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {/* Header with user icon and name */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-4">
              <UserCircle className="h-16 w-16 text-white" />
            </div>
            <div>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="firstName"
                    placeholder='enter first name'
                    value={editableUser.firstName}
                    onChange={handleInputChange}
                    className="text-2xl font-bold bg-white/10 text-white rounded px-2 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder='enter last name'
                    value={editableUser.lastName}
                    onChange={handleInputChange}
                    className="text-2xl font-bold bg-white/10 text-white rounded px-2 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 ml-2"
                  />
                </>
              ) : (
                <h1 className="text-2xl font-bold text-white">{`${user.firstName} ${user.lastName}`}</h1>
              )}
              <p className="text-blue-100">User Profile</p>
            </div>
          </div>
        </div>

        {/* User details */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</h2>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    placeholder='enter address'
                    value={editableUser.address}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 px-2 py-1"
                  />
                ) : (
                  <p className="mt-1 text-gray-900 dark:text-white">{user.address}</p>
                )}
              </div>
              
              <div>
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone Number</h2>
                {isEditing ? (
                  <input
                    type="text"
                    name="phoneNumber"
                    placeholder='enter phone number'
                    value={editableUser.phoneNumber}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 px-2 py-1"
                  />
                ) : (
                  <p className="mt-1 text-gray-900 dark:text-white">{user.phoneNumber}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Income</h2>
                {isEditing ? (
                  <input
                    type="text"
                    name="monthlyIncome"
                    placeholder='enter monthly income'
                    value={editableUser.monthlyIncome}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 px-2 py-1"
                  />
                ) : (
                  <p className="mt-1 text-gray-900 dark:text-white">{user.monthlyIncome}</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end space-x-2">
            {isEditing ? (
              <>
                <button 
                  onClick={handleCancel}
                  className="flex items-center bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
                >
                  <X className="h-4 w-4 mr-1" /> Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="flex items-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
                >
                  <Save className="h-4 w-4 mr-1" /> Save Changes
                </button>
              </>
            ) : (
              <button 
                onClick={() => setIsEditing(true)}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
