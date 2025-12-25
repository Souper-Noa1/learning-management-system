export interface Course {
  id: string | number;
  title: string;
  category: string;
  level: string;
  description: string;
  thumbnail?: string;
}

export interface CourseFormData {
  title: string;
  category: string;
  level: string;
  description: string;
  thumbnail?: string;
}

export interface User {
  email: string;
  name: string;
}

export interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  loading: boolean;
}