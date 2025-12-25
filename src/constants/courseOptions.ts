export const COURSE_CATEGORIES = [
  { value: '4SKILLS', label: '4 Skills' },
  { value: 'GRAMMAR', label: 'Grammar' },
  { value: 'SPEAKING', label: 'Speaking' },
  { value: 'WRITING', label: 'Writing' },
  { value: 'READING', label: 'Reading' },
] as const;

export const COURSE_LEVELS = [
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
  { value: 'Total Comprehension', label: 'Total Comprehension' },
] as const;

export const LOGIN_CREDENTIALS = {
  email: 'admin@course.com',
  password: 'admin123',
} as const;