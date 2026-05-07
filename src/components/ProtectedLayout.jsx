import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedLayout() {
  const { user, loading, logout, isAdmin } = useAuth();

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="app-layout">
      <header className="app-header">
        <h1>TaskPro</h1>
        <nav>
          <Link to="/tasks">Mis Tareas</Link>
          {isAdmin && <Link to="/admin/tasks">Todas las Tareas</Link>}
          {isAdmin && <Link to="/admin/users">Usuarios</Link>}
          <button onClick={handleLogout} className="logout-btn">
            Cerrar Sesión
          </button>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}