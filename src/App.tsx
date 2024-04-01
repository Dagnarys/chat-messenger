import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import './App.sass'
import ChatPage from "./pages/ChatPage.tsx";
import "./styles/Reset.sass"

function App() {

  return (

      <div className='App'>
          <HashRouter>
              <Routes>
                  <Route path="/" element ={<ChatPage/>}/>
                  <Route path="/" element ={<Navigate to="/" replace />}/>
              </Routes>
          </HashRouter>

      </div>

  )
}

export default App
