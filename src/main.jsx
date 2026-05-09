import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx' // This defines 'App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* This is where you USE the App component */}
    <App /> 
  </React.StrictMode>,
)