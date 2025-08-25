import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import ToastBoundary from './app/ToastBoundary';
import { AuthProvider } from './app/AuthProvider';
import { TenantProvider } from './app/TenantProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastBoundary>
        <AuthProvider>
          <TenantProvider>
            {/* The main application component */}
            <App />
          </TenantProvider>
        </AuthProvider>
      </ToastBoundary>
    </BrowserRouter>
  </React.StrictMode>,
);
// This file is the entry point for the React application.