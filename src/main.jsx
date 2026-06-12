import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { NavigationDataProvider } from './components/NavigationDataContext'
import { AuthProvider } from './context/AuthContext.jsx'
import { HelmetProvider } from 'react-helmet-async'
import NavigationBridge from './components/NavigationBridge.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <NavigationDataProvider>
        <BrowserRouter>
          <NavigationBridge />
          <HelmetProvider>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </HelmetProvider>
        </BrowserRouter>
      </NavigationDataProvider>
    </AuthProvider>
  </StrictMode>,
);
