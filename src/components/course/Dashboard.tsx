'use client';

import React from 'react';
import { Layout, Button } from 'antd';
import { LogoutOutlined, BookOutlined } from '@ant-design/icons';
import { User } from '@/types/course';
import CourseList from './CourseList';
import styles from '@/styles/course.module.css';

const { Header, Content } = Layout;

interface DashboardProps {
  onLogout: () => void;
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout, user }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className={styles.dashboardHeader}>
        <div className={styles.dashboardHeaderLeft}>
          <BookOutlined className={styles.dashboardIcon} />
          <h1 className={styles.dashboardTitle}>Course Management System</h1>
        </div>
        <div className={styles.dashboardHeaderRight}>
          <span>Welcome, {user.name}</span>
          <Button type="primary" danger icon={<LogoutOutlined />} onClick={onLogout}>
            Logout
          </Button>
        </div>
      </Header>
      <Content className={styles.dashboardContent}>
        <div className={styles.dashboardInner}>
          <CourseList />
        </div>
      </Content>
    </Layout>
  );
};

export default Dashboard;