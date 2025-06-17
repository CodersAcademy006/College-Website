import { apiClient } from '@/services/api';
import { 
  LearningPath, 
  CourseRecommendation, 
  MaterialRecommendation,
  StudentPerformance,
  StudentInterest 
} from '../types';

export const learningPathService = {
  async getLearningPath(studentId: string): Promise<LearningPath> {
    const response = await apiClient.get(`/learning-paths/${studentId}`);
    return response.data;
  },

  async updateLearningPath(studentId: string, path: Partial<LearningPath>): Promise<LearningPath> {
    const response = await apiClient.put(`/learning-paths/${studentId}`, path);
    return response.data;
  },

  async getCourseRecommendations(studentId: string): Promise<CourseRecommendation[]> {
    const response = await apiClient.get(`/learning-paths/${studentId}/course-recommendations`);
    return response.data;
  },

  async getMaterialRecommendations(studentId: string): Promise<MaterialRecommendation[]> {
    const response = await apiClient.get(`/learning-paths/${studentId}/material-recommendations`);
    return response.data;
  },

  async updateStudentPerformance(performance: StudentPerformance): Promise<void> {
    await apiClient.post('/student-performance', performance);
  },

  async updateStudentInterests(interests: StudentInterest): Promise<void> {
    await apiClient.post('/student-interests', interests);
  },

  async calculateLearningPath(studentId: string): Promise<LearningPath> {
    const response = await apiClient.post(`/learning-paths/${studentId}/calculate`);
    return response.data;
  }
}; 