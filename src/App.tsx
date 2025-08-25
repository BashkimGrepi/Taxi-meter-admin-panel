import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { Role } from './types/schema';
import TenantSelect from './pages/TenantSelect';
import AdminLayout from './layouts/AdminLayout';
import Drivers from './pages/Drivers';
import AddDriver from './pages/AddDriver';
import Transactions from './pages/Transactions';
import Payments from './pages/Payments';
import Profile from './pages/Profile';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Tenant chooser: requires auth but NOT a selected tenant */}
      <Route
        path="/tenant/select"
        element={
          <ProtectedRoute requireTenant={false} allow={[Role.ADMIN, Role.MANAGER]}>
            <TenantSelect />
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
        <Route index element={<Dashboard />} />
        <Route path="drivers" element={<Drivers />} />
        <Route path="drivers/add" element={<AddDriver />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="payments" element={<Payments />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
