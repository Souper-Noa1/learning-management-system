const API_BASE = 'https://6938e7e24618a71d77d19513.mockapi.io/api/v1/course';

export const getCourses = async (page = 1, limit = 10, search = '', category = '', level = '') => {
  let url = `${API_BASE}?page=${page}&limit=${limit}`;
  if (search) url += `&search=${search}`;
  if (category) url += `&category=${category}`;
  if (level) url += `&level=${level}`;
  const response = await fetch(url);
  return response.json();
};

export const getCourse = async (id) => {
  const response = await fetch(`${API_BASE}/${id}`);
  return response.json();
};

export const createCourse = async (data) => {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const updateCourse = async (id, data) => {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const deleteCourse = async (id) => {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  });
  return response.json();
};