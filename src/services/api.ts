import axiosInstance from './axiosConfig';
import { Course, CourseFormData } from '@/types/course';

export const getCourses = async (
  page: number = 1,
  limit: number = 10,
  search: string = '',
  category: string = '',
  level: string = ''
): Promise<Course[]> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search) params.append('search', search);
  if (category) params.append('category', category);
  if (level) params.append('level', level);

  const response = await axiosInstance.get<Course[]>(`/course?${params.toString()}`);
  return response.data;
};

export const getCourse = async (id: string | number): Promise<Course> => {
  const response = await axiosInstance.get<Course>(`/course/${id}`);
  return response.data;
};

export const createCourse = async (data: CourseFormData): Promise<Course> => {
  const response = await axiosInstance.post<Course>('/course', data);
  return response.data;
};

export const updateCourse = async (
  id: string | number,
  data: CourseFormData
): Promise<Course> => {
  const response = await axiosInstance.patch<Course>(`/course/${id}`, data);
  return response.data;
};

export const deleteCourse = async (id: string | number): Promise<void> => {
  await axiosInstance.delete(`/course/${id}`);
};