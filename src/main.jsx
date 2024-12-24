import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';  // Bootstrap CSS 임포트
import 'bootstrap/dist/js/bootstrap.bundle.min.js';  // Bootstrap JS 임포트
import 'bootstrap-icons/font/bootstrap-icons.css'; // Bootstrap icon 임포트

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <App />
  // </StrictMode>,
)
