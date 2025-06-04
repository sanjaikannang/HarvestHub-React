import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import CustomToaster from './Common/ui/Toaster.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <CustomToaster />
      <App />
  </StrictMode>,
)
