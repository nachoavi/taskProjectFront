import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthLayout() {
  const { user, loading, isLoggingIn, isAdmin } = useAuth();

  if (loading || isLoggingIn) {
    return <div className="loading">Cargando...</div>;
  }

  if (isAdmin) {
    return <Navigate to="/admin/users" replace />;
  }

  if (user) {
    return <Navigate to="/tasks" replace />;
  }

  return (
    <div className="auth-layout">
      <Outlet />
    </div>
  );
}
