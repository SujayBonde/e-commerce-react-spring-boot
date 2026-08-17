import React from 'react'
import { assets } from '../assets/assets'

const Navbar = ({setToken}) => {
  return (
    <div className='flex items-center py-2 px-[4%] justify-between'>
      <img className='w-37.5' src={assets.logo} alt="" />
      <h2 className='font-medium text-2xl'>ADMIN PANEL</h2>
      <button onClick={()=>setToken('')} className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm cursor-pointer'>LogOut</button>
    </div>
  )
}

export default Navbar