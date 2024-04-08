import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import './App.sass'
import WebSock from "./pages/WebSock.tsx";
import "./styles/Reset.sass"

function App() {

    return (
        <div>
            <WebSock/>
        </div>
    )
}


export default App
