import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import CommandCenterPro from './CommandCenterPro'
import CommandCenterInteractions from './CommandCenterInteractions'
import './pro.css'
import './interactions.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CommandCenterPro />
    <CommandCenterInteractions />
  </StrictMode>,
)
