import { Navigate, useLocation } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import axiosInstance from "../services/AxiosInstance";

interface ProtectedRouteProps {
  children: ReactNode;
  requireViva?: boolean;
}

const ProtectedRoute = ({ children, requireViva = true }: ProtectedRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVivaLinked, setIsVivaLinked] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAccess = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const res = await axiosInstance.get("/stripe/me");
        setIsAuthenticated(true);
        setIsVivaLinked(res.data.stripeLinked === true);
      } catch (err) {
        console.error("Access check failed:", err);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  // Handle authentication first
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  // Then check if Viva is required but not linked
  if (requireViva && !isVivaLinked) {
    // If we're on a route that requires Viva but user hasn't linked their account,
    // redirect to the viva-wallet page
    return <Navigate to="/viva-wallet" replace />;
  }

  // Otherwise, render the children components
  return <>{children}</>;
};

export default ProtectedRoute;