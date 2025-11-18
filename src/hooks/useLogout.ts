import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../app/AuthProvider";
import { useQueryClient } from "@tanstack/react-query";

export const useLogout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogout = useCallback(() => {
    console.log("loggin out and clearing cache...");
    queryClient.clear();
    logout();
    navigate("/login", { replace: true });
    console.log("logout complete, cache cleared.");
  }, [logout, navigate, queryClient]);

  return { handleLogout };
};
