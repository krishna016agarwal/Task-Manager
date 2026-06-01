import { createContext, useContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api/axios';

const AuthContext = createContext(null);

const getUserFromToken = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return null;
  }

  try {
    const decoded = jwtDecode(token);

    const currentTime = Date.now() / 1000;

    if (decoded.exp && decoded.exp < currentTime) {
      localStorage.removeItem('token');
      return null;
    }

    return {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role
    };
  } catch (error) {
    localStorage.removeItem('token');
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUserFromToken);
  const [loading, setLoading] = useState(false);

  const register = async (formData) => {
    setLoading(true);

    try {
      const response = await api.post('/auth/register', formData);
      const { token } = response.data.data;

      localStorage.setItem('token', token);

      const decodedUser = getUserFromToken();
      setUser(decodedUser);

      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const login = async (formData) => {
    setLoading(true);

    try {
      const response = await api.post('/auth/login', formData);
      const { token } = response.data.data;

      localStorage.setItem('token', token);

      const decodedUser = getUserFromToken();
      setUser(decodedUser);

      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};