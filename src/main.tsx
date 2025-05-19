import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Router } from './Router.tsx'
import { ClerkProvider } from '@clerk/clerk-react'
import { OrganizationProvider } from './hooks/organizationContex.tsx'


const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl='/'>
      <BrowserRouter>
        <OrganizationProvider>
          <Router />
        </OrganizationProvider>
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>,
)
