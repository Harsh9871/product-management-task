'use client';
import { useState } from 'react';
import { login } from '../lib/api';
import { saveToken, removeToken, isLoggedIn } from '../lib/auth';

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (email, password) => {
    setLoading(true);
    try {
      const res = await login({ email, password });
      saveToken(res.data.token);
      setError('');
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeToken();
  };

  return {
    handleLogin,
    logout,
    isLoggedIn,
    loading,
    error,
  };
};

export default useAuth;
