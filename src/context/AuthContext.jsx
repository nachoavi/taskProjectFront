import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import { demoUser } from '../services/demo/demoData';

const DEMO_KEY = 'demo_mode';
const AuthContext = createContext(null);

function base64UrlEncode(str) {
  const utf8Bytes = new TextEncoder().encode(JSON.stringify(str));
  let binary = '';
  utf8Bytes.forEach(byte => binary += String.fromCharCode(byte));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function createDemoToken(user) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    username: user.username,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
  };
  const signature = 'demo-signature';
  
  const encodedHeader = base64UrlEncode(header);
  const encodedPayload = base64UrlEncode(payload);
  const encodedSignature = btoa(signature).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  
  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    const demoMode = localStorage.getItem(DEMO_KEY);
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      setIsDemo(demoMode === 'true');
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    setIsLoggingIn(true);
    try {
      const response = await authService.login(credentials);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem(DEMO_KEY, 'false');
      setUser(response.user);
      setIsDemo(false);
      return response;
    } finally {
      setIsLoggingIn(false);
    }
  };

  const loginDemo = () => {
    const demoToken = createDemoToken(demoUser);
    localStorage.setItem(DEMO_KEY, 'true');
    localStorage.setItem('token', demoToken);
    localStorage.setItem('user', JSON.stringify(demoUser));
    setUser(demoUser);
    setIsDemo(true);
    return { user: demoUser, token: demoToken };
  };

  const register = async (data) => {
    return authService.register(data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem(DEMO_KEY);
    setUser(null);
    setIsDemo(false);
  };

  const isAdmin = user?.role === 'admin' || isDemo;

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, isAdmin, isLoggingIn, isDemo, loginDemo }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}