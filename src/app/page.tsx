'use client';

import React from 'react';
import { ConfigProvider, Spin } from 'antd';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import LoginScreen from '@/components/auth/LoginScreen';
import Dashboard from '@/components/course/Dashboard';

function MainApp() {
  const { user, login, logout, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return <LoginScreen onLogin={login} />;
  }

  return <Dashboard onLogout={logout} user={user} />;
}

export default function Home() {
  return (
    <ConfigProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ConfigProvider>
  );
}