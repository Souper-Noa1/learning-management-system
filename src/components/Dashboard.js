'use client';

import React from 'react';
import { Layout, Button } from 'antd';
import { LogoutOutlined, BookOutlined } from '@ant-design/icons';
import CourseList from './CourseList';

const { Header, Content } = Layout;

export default function Dashboard({ onLogout, user }) {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        background: '#fff', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '0 32px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <BookOutlined style={{ fontSize: '24px', color: '#667eea', marginRight: '12px' }} />
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
            Course Management System
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span>Welcome, {user.name}</span>
          <Button type="primary" danger icon={<LogoutOutlined />} onClick={onLogout}>
            Logout
          </Button>
        </div>
      </Header>
      <Content style={{ padding: '24px', background: '#f0f2f5' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <CourseList />
        </div>
      </Content>
    </Layout>
  );
}