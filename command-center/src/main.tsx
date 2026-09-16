import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import CommandCenterPro from './CommandCenterPro'
import './pro.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CommandCenterPro />
  </StrictMode>,
)
