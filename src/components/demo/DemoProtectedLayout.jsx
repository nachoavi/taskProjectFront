import { useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function DemoProtectedLayout() {
  const { user, loading, logout, isDemo } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="app-layout">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <span>Cargando...</span>
        </div>
      </div>
    );
  }

  if (!user || !isDemo) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-brand">
          <div className="header-brand-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4"/>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
            </svg>
          </div>
          <h1>TaskPro</h1>
          <span style={{
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            padding: '2px 8px',
            borderRadius: 'var(--radius-sm)',
            fontSize: 11,
            fontWeight: 600,
            marginLeft: 8
          }}>
            DEMO
          </span>
        </div>
        <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </>
            )}
          </svg>
        </button>
        <nav className={`header-nav ${menuOpen ? 'open' : ''}`}>
          <Link to="/demo/tasks" className={`nav-link ${isActive('/demo/tasks') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11l3 3L22 4"/>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
            </svg>
            Mis Tareas
          </Link>
          <div className="nav-divider"></div>
          <Link to="/demo/admin/tasks" className={`nav-link ${isActive('/demo/admin/tasks') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
            Gestión Tareas
          </Link>
          <Link to="/demo/admin/users" className={`nav-link ${isActive('/demo/admin/users') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87"/>
              <path d="M16 3.13a4 4 0 010 7.75"/>
            </svg>
            Usuarios
          </Link>
          <div className="nav-divider"></div>
          <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="btn-logout">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16,17 21,12 16,7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
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