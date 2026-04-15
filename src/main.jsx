import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initIAP } from './utils/tipjar'

// Fire-and-forget: configure RevenueCat on native, no-op on web.
initIAP();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
