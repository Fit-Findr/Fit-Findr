import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import MainRouting from './MainRouting.jsx'
import './index.css'

export const baseUrl = `http://localhost:8080`;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MainRouting />
  </StrictMode>,
)
