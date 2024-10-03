import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import MainRouting from './MainRouting.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MainRouting />
  </StrictMode>,
)
