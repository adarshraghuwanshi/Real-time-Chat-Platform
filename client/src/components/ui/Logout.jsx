import React from 'react'
import { useNavigate } from 'react-router-dom';




export default function Logout() {
const Navigate = useNavigate();

  const handleLogout = () => {

  localStorage.removeItem('chat-app-user');
  Navigate('/auth'); 

}
  return (
    <div>
      <button className=' text-red-600 font-semibold  hover:text-red-100' onClick={handleLogout}> Logout </button>
      
    </div>
  )
}
