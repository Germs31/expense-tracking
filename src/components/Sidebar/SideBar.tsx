import React from 'react'
import Link from 'next/link'

const SideBar = () => {

  const links: string[] = ["add expense", " view all"]
  return (
    <div className='bg-amber-400 text-amber-50 h-screen w-55 p-8'>
      {/* Main Content */}
      <div>
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-xl font-bold text-gray-700">GN</span>
          </div>
        </div>
      </div>

      {/* Page Links */}
      <div className="mt-10">
        <div className='flex flex-col'>
          {
            links.map((link: string, index: number) => (
              <Link className="hover:text-black" key={index} href={`/${link}`}> {link} </Link>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default SideBar