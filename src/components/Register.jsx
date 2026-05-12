import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({ username, email, password });
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2>Crear Cuenta</h2>
      {error && (
        <div className="error-message">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Nombre de usuario</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="nombre.apellido"
            autoComplete="username"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="correo@empresa.com"
            autoComplete="email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Mínimo 6 caracteres"
            autoComplete="new-password"
          />
        </div>
        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? (
            <>
              <span className="loading-spinner" style={{width: 16, height: 16, margin: 0}}></span>
              Creando cuenta...
            </>
          ) : (
            'Crear Cuenta'
          )}
        </button>
      </form>
      <p className="auth-link">
        ¿Ya tiene cuenta? <Link to="/login">Iniciar Sesión</Link>
      </p>
    </>
  );
}