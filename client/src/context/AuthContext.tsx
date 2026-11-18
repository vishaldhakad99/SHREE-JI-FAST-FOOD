import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { AdminUser } from '../types';

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string, user: AdminUser) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: () => {},
  logout: async () => {},
  checkAuth: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('shreeji_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data?.success && res.data?.admin) {
        setUser(res.data.admin);
        localStorage.setItem('shreeji_admin_user', JSON.stringify(res.data.admin));
      } else {
        setUser(null);
        localStorage.removeItem('shreeji_admin_user');
        localStorage.removeItem('shreeji_admin_token');
      }
    } catch {
      setUser(null);
      localStorage.removeItem('shreeji_admin_user');
      localStorage.removeItem('shreeji_admin_token');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = (token: string, adminUser: AdminUser) => {
    localStorage.setItem('shreeji_admin_token', token);
    localStorage.setItem('shreeji_admin_user', JSON.stringify(adminUser));
    setUser(adminUser);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.warn('Logout request failed or server unreachable:', e);
    } finally {
      localStorage.removeItem('shreeji_admin_token');
      localStorage.removeItem('shreeji_admin_user');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
