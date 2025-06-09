import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Auth from './pages/auth'
import Chat from './pages/chat'   
import Profile from './pages/profile'

function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<Navigate to="/auth"  />} />

     
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
