import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'teacher', 'student']),
});

export const studentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[\d\s-]{10,}$/, 'Invalid phone number'),
  course: z.string().min(1, 'Course is required'),
  status: z.enum(['active', 'inactive', 'pending']),
});

export const courseSchema = z.object({
  name: z.string().min(2, 'Course name must be at least 2 characters'),
  code: z.string().regex(/^[A-Z]{2,3}\d{3}$/, 'Invalid course code format'),
  department: z.string().min(1, 'Department is required'),
  instructor: z.string().min(1, 'Instructor is required'),
  schedule: z.object({
    days: z.array(z.string()),
    time: z.string(),
    location: z.string(),
  }),
});

export const attendanceSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  courseId: z.string().min(1, 'Course ID is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  status: z.enum(['present', 'absent', 'late']),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type StudentFormData = z.infer<typeof studentSchema>;
export type CourseFormData = z.infer<typeof courseSchema>;
export type AttendanceFormData = z.infer<typeof attendanceSchema>; 