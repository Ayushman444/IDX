import React from 'react'
import { JoinedUser } from './JoinedUser';
export const SideBar = () => {
    const clients = ["Anuj", "Aman" , "Ayushman" , "Pramod"];

  return (
    <div className='w-[10vw] h-[100vh] border border-rounded rounded-lg bg-blue-200 relative'>
        <h1 className='text-2xl font-bold ml-6'>IDx</h1>

        <div className='w-[100%] h-[70%] absolute bg-gray-500'>

        </div>
        <button className="btn btn-accent absolute bottom-[100px] m-1">Copy Room Id</button>
        <button className="btn btn-error absolute bottom-10 left-4">Leave</button>
    </div>
  )
}
