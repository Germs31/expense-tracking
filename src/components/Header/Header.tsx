import React from 'react'

const Header = () => {
  return (
    <div className="bg-neutral-900 text-white flex justify-between p-6">
      <div className="text-2xl font-bold">Dashboard</div>


      <button className="bg-emerald-500 hover:bg-emerald-900 text-white font-bold py-2 px-4 rounded">
        sign out
      </button>
    </div>
  )
}

export default Header