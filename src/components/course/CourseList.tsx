'use client';

import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Select, Modal, message, Card, Space, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { Course, CourseFormData } from '@/types/course';
import { COURSE_CATEGORIES, COURSE_LEVELS } from '@/constants/courseOptions';
import { getCourses, getCourse, createCourse, updateCourse, deleteCourse } from '@/services/api';
import CourseForm from './CourseForm';
import styles from '@/styles/course.module.css';
import type { TablePaginationConfig } from 'antd';

const { Option } = Select;

const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState<{
    search: string;
    category: string;
    level: string;
  }>({
    search: '',
    category: '',
    level: '',
  });
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const fetchCourses = async (page: number = 1) => {
    setLoading(true);
    try {
      const data = await getCourses(page, 10, filters.search, filters.category, filters.level);
      const coursesArray = Array.isArray(data) ? data : [];
      setCourses(coursesArray);
      setPagination((prev) => ({
        ...prev,
        current: page,
        total: coursesArray.length > 0 ? coursesArray.length * 5 : 0,
      }));
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search, filters.category, filters.level]);

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    fetchCourses(newPagination.current || 1);
  };

  const handleDelete = async (id: string | number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this course?',
      onOk: async () => {
        try {
          await deleteCourse(id);
          message.success('Course deleted successfully');
          fetchCourses(pagination.current || 1);
        } catch (error) {
          // Error handled by interceptor
        }
      },
    });
  };

  const handleEdit = async (id: string | number) => {
    try {
      const course = await getCourse(id);
      setEditingCourse(course);
      setModalVisible(true);
    } catch (error) {
      // Error handled by interceptor
    }
  };

  const handleSubmit = async (values: CourseFormData) => {
    setFormLoading(true);
    try {
      if (editingCourse) {
        await updateCourse(editingCourse.id, values);
        message.success('Course updated successfully');
      } else {
        await createCourse(values);
        message.success('Course created successfully');
      }
      setModalVisible(false);
      setEditingCourse(null);
      fetchCourses(pagination.current || 1);
    } catch (error) {
      // Error handled by interceptor
    } finally {
      setFormLoading(false);
    }
  };

  const columns = [
    {
      title: 'Thumbnail',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      width: 100,
      render: (url: string) => (
        <img
          src={url || 'https://via.placeholder.com/50'}
          alt="course"
          className={styles.thumbnail}
        />
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      render: (level: string) => <Tag color="green">{level}</Tag>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_: unknown, record: Course) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.id)}
            size="small"
          >
            Edit
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            size="small"
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card className={styles.cardContainer}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div className={styles.headerContainer}>
            <h2 className={styles.pageTitle}>Course Management</h2>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingCourse(null);
                setModalVisible(true);
              }}
              size="large"
            >
              Add New Course
            </Button>
          </div>

          <Space size="middle" wrap>
            <Input
              placeholder="Search courses..."
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              allowClear
            />
            <Select
              placeholder="Category"
              style={{ width: 150 }}
              onChange={(value) => setFilters((prev) => ({ ...prev, category: value || '' }))}
              allowClear
            >
              {COURSE_CATEGORIES.map((cat) => (
                <Option key={cat.value} value={cat.value}>
                  {cat.label}
                </Option>
              ))}
            </Select>
            <Select
              placeholder="Level"
              style={{ width: 150 }}
              onChange={(value) => setFilters((prev) => ({ ...prev, level: value || '' }))}
              allowClear
            >
              {COURSE_LEVELS.map((lvl) => (
                <Option key={lvl.value} value={lvl.value}>
                  {lvl.label}
                </Option>
              ))}
            </Select>
          </Space>
        </Space>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={courses}
          rowKey="id"
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
        />
      </Card>

      <Modal
        title={editingCourse ? 'Edit Course' : 'Add New Course'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingCourse(null);
        }}
        footer={null}
        width={600}
      >
        <CourseForm
          course={editingCourse}
          onSubmit={handleSubmit}
          onCancel={() => {
            setModalVisible(false);
            setEditingCourse(null);
          }}
          loading={formLoading}
        />
      </Modal>
    </div>
  );
};

export default CourseList;