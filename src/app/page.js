'use client';

import React, { useState, createContext, useContext } from 'react';
import { ConfigProvider } from 'antd';
import LoginScreen from '@/components/LoginScreen';
import Dashboard from '@/components/Dashboard';

// Auth Context
const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default function Home() {
  return (
    <ConfigProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ConfigProvider>
  );
}

function MainApp() {
  const { user, login, logout } = useAuth();

  if (!user) {
    return <LoginScreen onLogin={login} />;
  }

  return <Dashboard onLogout={logout} user={user} />;
}