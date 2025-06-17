export interface LearningPath {
  id: string;
  studentId: string;
  courses: CourseRecommendation[];
  materials: MaterialRecommendation[];
  progress: number;
  lastUpdated: Date;
}

export interface CourseRecommendation {
  courseId: string;
  name: string;
  description: string;
  matchScore: number;
  prerequisites: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: string;
}

export interface MaterialRecommendation {
  id: string;
  title: string;
  type: 'video' | 'article' | 'quiz' | 'assignment';
  url: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  tags: string[];
}

export interface StudentPerformance {
  studentId: string;
  courseId: string;
  grades: {
    assignments: number;
    quizzes: number;
    exams: number;
  };
  attendance: number;
  engagement: number;
  lastUpdated: Date;
}

export interface StudentInterest {
  studentId: string;
  topics: string[];
  skills: string[];
  careerGoals: string[];
  lastUpdated: Date;
} 