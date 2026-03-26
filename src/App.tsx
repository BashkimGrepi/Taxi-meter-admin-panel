import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { Role } from "./types/schema";
import TenantSelect from "./pages/TenantSelect";
import AdminLayout from "./layouts/AdminLayout";
import Drivers from "./pages/Drivers";
import Rides from "./pages/Rides";
import Transactions from "./pages/Transactions";
import Payments from "./pages/Payments";
import Profile from "./pages/Profile";
import PricingPoliciesPage from "./pages/PricingPoliciesPage";
import { DashboardErrorBoundary } from "./components/DashboardErrorBoundary";
import { DriversErrorBoundary } from "./components/DriversErrorBoundary";
import { TenantSelectErrorBoundary } from "./components/TenantSelectErrorBoundary";
import { PaymentsErrorBoundary } from "./components/PaymentsErrorBoundary";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Tenant chooser: requires auth but NOT a selected tenant */}
      <Route
        path="/tenant/select"
        element={
          <ProtectedRoute
            requireTenant={false}
            allow={[Role.ADMIN, Role.MANAGER]}
          >
            <TenantSelectErrorBoundary>
              <TenantSelect />
            </TenantSelectErrorBoundary>
          </ProtectedRoute>
        }
      />

      {/* Admin layout: requires auth + tenant */}
      <Route
        path="/"
        element={
          <ProtectedRoute allow={[Role.ADMIN, Role.MANAGER]} requireTenant>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={
            <DashboardErrorBoundary>
              <Dashboard />
            </DashboardErrorBoundary>
          }
        />
        <Route path="rides" element={<Rides />} />
        <Route
          path="drivers"
          element={
            <DriversErrorBoundary>
              <Drivers />
            </DriversErrorBoundary>
          }
        />
        <Route path="transactions" element={<Transactions />} />
        <Route
          path="payments"
          element={
            <PaymentsErrorBoundary>
              <Payments />
            </PaymentsErrorBoundary>
          }
        />
        <Route path="profile" element={<Profile />} />
        <Route path="pricing" element={<PricingPoliciesPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
