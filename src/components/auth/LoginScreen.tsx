'use client';

import React, { useState } from 'react';
import { Layout, Card, Input, Button, message, Form } from 'antd';
import { BookOutlined } from '@ant-design/icons';
import { User } from '@/types/course';
import { LOGIN_CREDENTIALS } from '@/constants/courseOptions';
import styles from '@/styles/course.module.css';

const { Content } = Layout;

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      if (
        values.email === LOGIN_CREDENTIALS.email &&
        values.password === LOGIN_CREDENTIALS.password
      ) {
        message.success('Login successful!');
        onLogin({ email: values.email, name: 'Admin' });
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
    <Layout className={styles.loginContainer}>
      <Content className={styles.loginContent}>
        <Card className={styles.loginCard}>
          <div className={styles.loginHeader}>
            <BookOutlined className={styles.loginIcon} />
            <h1 className={styles.loginTitle}>Course Management</h1>
            <p className={styles.loginSubtitle}>Sign in to your account</p>
          </div>

          <Form form={form} onFinish={handleLogin} layout="vertical">
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' },
              ]}
            >
              <Input size="large" placeholder="admin@course.com" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
                { min: 6, message: 'Password must be at least 6 characters!' },
              ]}
            >
              <Input.Password size="large" placeholder="admin123" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" loading={loading} block>
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <div className={styles.credentialsBox}>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
              Welcome to our Course Management System!
            </p>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
              Please sign in to continue.
            </p>
          </div>
        </Card>
      </Content>
    </Layout>
  );
};

export default LoginScreen;