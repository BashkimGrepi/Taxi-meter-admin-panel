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
import { AgGridProvider } from "ag-grid-react";
import { AllCommunityModule } from "ag-grid-community";

const modules = [AllCommunityModule];



ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <QueryProvider>
          <ToastBoundary>
            <AuthProvider>
              <TenantProvider>
                {/* The main application component */}
                <AgGridProvider modules={modules}>
                  <App />
                </AgGridProvider>
              </TenantProvider>
            </AuthProvider>
          </ToastBoundary>
        </QueryProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
// This file is the entry point for the React application.
