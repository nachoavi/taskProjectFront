import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthLayout() {
  const { user, loading, isLoggingIn, isAdmin, isDemo } = useAuth();

  if (loading || isLoggingIn) {
    return (
      <div className="auth-layout">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <span>Cargando...</span>
        </div>
      </div>
    );
  }

  if (isDemo) {
    return <Navigate to="/demo/admin/users" replace />;
  }

  if (isAdmin) {
    return <Navigate to="/admin/users" replace />;
  }

  if (user) {
    return <Navigate to="/tasks" replace />;
  }

  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-brand">
            <div className="auth-brand-logo">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4"/>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
              </svg>
            </div>
            <h1>TaskPro</h1>
            <p>Gestor de tareas empresariales</p>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}