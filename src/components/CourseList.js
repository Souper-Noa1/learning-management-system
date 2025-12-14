'use client';

import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Select, Modal, message, Card, Space, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { getCourses, getCourse, createCourse, updateCourse, deleteCourse } from '@/services/api';

const { Option } = Select;

// Course Form Component
function CourseForm({ course, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    level: '',
    description: '',
    thumbnail: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || '',
        category: course.category || '',
        level: course.level || '',
        description: course.description || '',
        thumbnail: course.thumbnail || ''
      });
    }
  }, [course]);

  const validateField = (name, value) => {
    if (name === 'title' && !value) return 'Please input course title!';
    if (name === 'category' && !value) return 'Please select category!';
    if (name === 'level' && !value) return 'Please select level!';
    if (name === 'description' && !value) return 'Please input description!';
    return '';
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      setFormData({ title: '', category: '', level: '', description: '', thumbnail: '' });
      setErrors({});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Course Title *</label>
        <Input 
          placeholder="Enter course title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          status={errors.title ? 'error' : ''}
        />
        {errors.title && <div style={{ color: '#ff4d4f', fontSize: '14px', marginTop: '4px' }}>{errors.title}</div>}
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Category *</label>
        <Select
          placeholder="Select category"
          style={{ width: '100%' }}
          value={formData.category || undefined}
          onChange={(value) => handleChange('category', value)}
          status={errors.category ? 'error' : ''}
        >
          <Option value="4SKILLS">4 Skills</Option>
          <Option value="GRAMMAR">Grammar</Option>
          <Option value="SPEAKING">Speaking</Option>
          <Option value="WRITING">Writing</Option>
          <Option value="READING">Reading</Option>
        </Select>
        {errors.category && <div style={{ color: '#ff4d4f', fontSize: '14px', marginTop: '4px' }}>{errors.category}</div>}
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Level *</label>
        <Select
          placeholder="Select level"
          style={{ width: '100%' }}
          value={formData.level || undefined}
          onChange={(value) => handleChange('level', value)}
          status={errors.level ? 'error' : ''}
        >
          <Option value="Beginner">Beginner</Option>
          <Option value="Intermediate">Intermediate</Option>
          <Option value="Advanced">Advanced</Option>
          <Option value="Total Comprehension">Total Comprehension</Option>
        </Select>
        {errors.level && <div style={{ color: '#ff4d4f', fontSize: '14px', marginTop: '4px' }}>{errors.level}</div>}
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Description *</label>
        <Input.TextArea 
          rows={4} 
          placeholder="Enter course description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          status={errors.description ? 'error' : ''}
        />
        {errors.description && <div style={{ color: '#ff4d4f', fontSize: '14px', marginTop: '4px' }}>{errors.description}</div>}
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Thumbnail URL</label>
        <Input 
          placeholder="https://example.com/image.jpg"
          value={formData.thumbnail}
          onChange={(e) => handleChange('thumbnail', e.target.value)}
        />
      </div>

      <Space>
        <Button type="primary" onClick={handleSubmit} loading={loading}>
          {course ? 'Update Course' : 'Create Course'}
        </Button>
        <Button onClick={onCancel}>Cancel</Button>
      </Space>
    </div>
  );
}

// Main Course List Component
export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [filters, setFilters] = useState({ search: '', category: '', level: '' });
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const fetchCourses = async (page = 1) => {
  setLoading(true);
  try {
    const data = await getCourses(page, 10, filters.search, filters.category, filters.level);
    
    // Ensure data is an array
    const coursesArray = Array.isArray(data) ? data : [];
    
    setCourses(coursesArray);
    setPagination(prev => ({ 
      ...prev, 
      current: page, 
      total: coursesArray.length > 0 ? coursesArray.length * 5 : 0 
    }));
  } catch (error) {
    console.error('Error fetching courses:', error);
    message.error('Failed to fetch courses');
    setCourses([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
  fetchCourses(1); 
}, [filters.search, filters.category, filters.level]);

  const handleTableChange = (newPagination) => {
    fetchCourses(newPagination.current);
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this course?',
      onOk: async () => {
        try {
          await deleteCourse(id);
          message.success('Course deleted successfully');
          fetchCourses(pagination.current);
        } catch (error) {
          message.error('Failed to delete course');
        }
      },
    });
  };

  const handleEdit = async (id) => {
    try {
      const course = await getCourse(id);
      setEditingCourse(course);
      setModalVisible(true);
    } catch (error) {
      message.error('Failed to fetch course details');
    }
  };

  const handleSubmit = async (values) => {
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
      fetchCourses(pagination.current);
    } catch (error) {
      message.error('Operation failed');
    }
  };

  const columns = [
    {
      title: 'Thumbnail',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      width: 100,
      render: (url) => (
        <img 
          src={url || 'https://via.placeholder.com/50'} 
          alt="course" 
          style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px' }} 
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
      render: (category) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      render: (level) => <Tag color="green">{level}</Tag>,
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
      render: (_, record) => (
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
      <Card style={{ marginBottom: '16px' }}>
        <Space vertical style={{ width: '100%' }} size="large">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Course Management</h2>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => { setEditingCourse(null); setModalVisible(true); }}
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
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              allowClear
            />
            <Select
              placeholder="Category"
              style={{ width: 150 }}
              onChange={(value) => setFilters(prev => ({ ...prev, category: value || '' }))}
              allowClear
            >
              <Option value="4SKILLS">4 Skills</Option>
              <Option value="GRAMMAR">Grammar</Option>
              <Option value="SPEAKING">Speaking</Option>
              <Option value="WRITING">Writing</Option>
              <Option value="READING">Reading</Option>
            </Select>
            <Select
              placeholder="Level"
              style={{ width: 150 }}
              onChange={(value) => setFilters(prev => ({ ...prev, level: value || '' }))}
              allowClear
            >
              <Option value="Beginner">Beginner</Option>
              <Option value="Intermediate">Intermediate</Option>
              <Option value="Advanced">Advanced</Option>
              <Option value="Total Comprehension">Total Comprehension</Option>
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
        onCancel={() => { setModalVisible(false); setEditingCourse(null); }}
        footer={null}
        width={600}
      >
        <CourseForm
          course={editingCourse}
          onSubmit={handleSubmit}
          onCancel={() => { setModalVisible(false); setEditingCourse(null); }}
        />
      </Modal>
    </div>
  );
}