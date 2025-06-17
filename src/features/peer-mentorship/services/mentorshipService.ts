import { apiClient } from '@/services/api';
import {
  Mentor,
  Mentee,
  MentorshipSession,
  ChatMessage,
  MentorshipMatch,
  Availability
} from '../types';

export const mentorshipService = {
  // Mentor Management
  async getMentors(): Promise<Mentor[]> {
    const response = await apiClient.get('/mentors');
    return response.data;
  },

  async getMentor(id: string): Promise<Mentor> {
    const response = await apiClient.get(`/mentors/${id}`);
    return response.data;
  },

  async updateMentorAvailability(id: string, availability: Availability[]): Promise<Mentor> {
    const response = await apiClient.put(`/mentors/${id}/availability`, { availability });
    return response.data;
  },

  // Mentee Management
  async getMentees(): Promise<Mentee[]> {
    const response = await apiClient.get('/mentees');
    return response.data;
  },

  async getMentee(id: string): Promise<Mentee> {
    const response = await apiClient.get(`/mentees/${id}`);
    return response.data;
  },

  // Session Management
  async getSessions(userId: string): Promise<MentorshipSession[]> {
    const response = await apiClient.get(`/sessions?userId=${userId}`);
    return response.data;
  },

  async createSession(session: Omit<MentorshipSession, 'id'>): Promise<MentorshipSession> {
    const response = await apiClient.post('/sessions', session);
    return response.data;
  },

  async updateSession(id: string, session: Partial<MentorshipSession>): Promise<MentorshipSession> {
    const response = await apiClient.put(`/sessions/${id}`, session);
    return response.data;
  },

  // Chat Management
  async getMessages(userId: string, otherUserId: string): Promise<ChatMessage[]> {
    const response = await apiClient.get(`/messages?userId=${userId}&otherUserId=${otherUserId}`);
    return response.data;
  },

  async sendMessage(message: Omit<ChatMessage, 'id' | 'timestamp' | 'status'>): Promise<ChatMessage> {
    const response = await apiClient.post('/messages', message);
    return response.data;
  },

  // Matching
  async findMatches(userId: string): Promise<MentorshipMatch[]> {
    const response = await apiClient.get(`/matches?userId=${userId}`);
    return response.data;
  },

  async acceptMatch(matchId: string): Promise<MentorshipMatch> {
    const response = await apiClient.put(`/matches/${matchId}/accept`);
    return response.data;
  },

  async rejectMatch(matchId: string): Promise<MentorshipMatch> {
    const response = await apiClient.put(`/matches/${matchId}/reject`);
    return response.data;
  },

  // Feedback
  async submitFeedback(sessionId: string, feedback: { rating: number; comment: string }): Promise<void> {
    await apiClient.post(`/sessions/${sessionId}/feedback`, feedback);
  }
}; 