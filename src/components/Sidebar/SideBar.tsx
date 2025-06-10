"use client"

import React from 'react'
import {useRouter} from 'next/navigation'

const SideBar = () => {
  const router = useRouter()
  return (
    <div className='bg-neutral-900 text-white h-screen w-64 p-8'>
      {/* Main Content */}
      <div>
        <div className="flex items-center">
          <div className="text-white font-bold text-2xl" onClick={() => router.push('/')}>TRAX</div>
        </div>
        <div 
        className="flex items-center text-green-500 hover:text-green-400 cursor-pointer bg-transparent font-medium my-6"
        onClick={() => router.push('/add')}
        >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 mr-2" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Expense
        </div>
        <div 
        className="flex items-center text-green-500 hover:text-green-400 cursor-pointer bg-transparent font-medium my-6"
        onClick={() => router.push('/user')}
        >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 mr-2" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" 
          />
        </svg>
        User Profile
        </div>
      </div>
    </div>
  )
}

export default SideBar