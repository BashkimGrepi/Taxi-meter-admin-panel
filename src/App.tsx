import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminProfile from './pages/AdminProfile';
import AddDriver from './pages/AddDriver';
import Login from './pages/Login';
import Register from './pages/Register';
import VivaWallet from './pages/VivaWallet';
import StripeCallback from './pages/StripeCallback';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Update this route to handle ALL /stripe/callback URLs regardless of query params */}
        <Route path="/stripe/callback" element={<StripeCallback />} />
        
        {/* Protected admin routes */}
        <Route path="/" element={
          <ProtectedRoute requireViva={false}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="add-driver" element={
            <ProtectedRoute>
              <AddDriver />
            </ProtectedRoute>
          } />
          <Route path="viva-wallet" element={<VivaWallet />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;