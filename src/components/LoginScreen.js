'use client';

import React, { useState } from 'react';
import { Layout, Card, Input, Button, message } from 'antd';
import { BookOutlined } from '@ant-design/icons';

const { Content } = Layout;

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Please input your email!';
    if (!emailRegex.test(email)) return 'Please enter a valid email!';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Please input your password!';
    if (password.length < 6) return 'Password must be at least 6 characters!';
    return '';
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateEmail(value));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(validatePassword(value));
  };

  const isFormValid = () => {
    return email && password && !emailError && !passwordError;
  };

  const handleLogin = async () => {
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    
    setEmailError(emailErr);
    setPasswordError(passwordErr);

    if (emailErr || passwordErr) return;

    setLoading(true);
    try {
      if (email === 'admin@course.com' && password === 'admin123') {
        message.success('Login successful!');
        onLogin({ email, name: 'Admin' });
      } else {
        message.error('Invalid email or password');
      }
    } catch (error) {
      message.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #1175E8 100%)' }}>
      <Content style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <Card style={{ width: '100%', maxWidth: '450px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <BookOutlined style={{ fontSize: '48px', color: '#667eea' }} />
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '16px' }}>Course Management</h1>
            <p style={{ color: '#6b7280', marginTop: '8px' }}>Sign in to your account</p>
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Email</label>
              <Input 
                size="large" 
                placeholder="admin@course.com"
                value={email}
                onChange={handleEmailChange}
                status={emailError ? 'error' : ''}
              />
              {emailError && <div style={{ color: '#ff4d4f', fontSize: '14px', marginTop: '4px' }}>{emailError}</div>}
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Password</label>
              <Input.Password 
                size="large" 
                placeholder="admin123"
                value={password}
                onChange={handlePasswordChange}
                status={passwordError ? 'error' : ''}
                onPressEnter={handleLogin}
              />
              {passwordError && <div style={{ color: '#ff4d4f', fontSize: '14px', marginTop: '4px' }}>{passwordError}</div>}
            </div>

            <Button 
              type="primary" 
              size="large" 
              loading={loading}
              onClick={handleLogin}
              disabled={!isFormValid()}
              block
            >
              Sign In
            </Button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '16px', padding: '16px', background: '#eff6ff', borderRadius: '8px' }}>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Welcome to our Course Management System!</p>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>Please sign in to continue.</p>
          </div>
        </Card>
      </Content>
    </Layout>
  );
}