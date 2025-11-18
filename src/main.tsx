import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import ToastBoundary from "./app/ToastBoundary";
import { AuthProvider } from "./app/AuthProvider";
import { TenantProvider } from "./app/TenantProvider";
import { QueryProvider } from "./app/QueryProvider";
import { ErrorBoundary } from "./components/ErrorBoundary";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <QueryProvider>
          <ToastBoundary>
            <AuthProvider>
              <TenantProvider>
                {/* The main application component */}
                <App />
              </TenantProvider>
            </AuthProvider>
          </ToastBoundary>
        </QueryProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
// This file is the entry point for the React application.
