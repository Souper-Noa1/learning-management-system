'use client';

import React from 'react';
import { Form, Input, Select, Button, Space } from 'antd';
import { Course, CourseFormData } from '@/types/course';
import { COURSE_CATEGORIES, COURSE_LEVELS } from '@/constants/courseOptions';

const { Option } = Select;
const { TextArea } = Input;

interface CourseFormProps {
  course: Course | null;
  onSubmit: (values: CourseFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const CourseForm: React.FC<CourseFormProps> = ({ course, onSubmit, onCancel, loading = false }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (course) {
      form.setFieldsValue({
        title: course.title,
        category: course.category,
        level: course.level,
        description: course.description,
        thumbnail: course.thumbnail,
      });
    } else {
      form.resetFields();
    }
  }, [course, form]);

  const handleSubmit = async (values: CourseFormData) => {
    await onSubmit(values);
  };

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical">
      <Form.Item
        label="Course Title"
        name="title"
        rules={[{ required: true, message: 'Please input course title!' }]}
      >
        <Input placeholder="Enter course title" />
      </Form.Item>

      <Form.Item
        label="Category"
        name="category"
        rules={[{ required: true, message: 'Please select category!' }]}
      >
        <Select placeholder="Select category">
          {COURSE_CATEGORIES.map((cat) => (
            <Option key={cat.value} value={cat.value}>
              {cat.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Level"
        name="level"
        rules={[{ required: true, message: 'Please select level!' }]}
      >
        <Select placeholder="Select level">
          {COURSE_LEVELS.map((lvl) => (
            <Option key={lvl.value} value={lvl.value}>
              {lvl.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: 'Please input description!' }]}
      >
        <TextArea rows={4} placeholder="Enter course description" />
      </Form.Item>

      <Form.Item label="Thumbnail URL" name="thumbnail">
        <Input placeholder="https://example.com/image.jpg" />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            {course ? 'Update Course' : 'Create Course'}
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default CourseForm;