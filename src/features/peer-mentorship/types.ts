export interface Mentor {
  id: string;
  studentId: string;
  name: string;
  email: string;
  photo?: string;
  course: string;
  expertise: string[];
  rating: number;
  availability: Availability[];
  bio: string;
  status: 'active' | 'inactive';
}

export interface Mentee {
  id: string;
  studentId: string;
  name: string;
  email: string;
  photo?: string;
  course: string;
  goals: string[];
  currentMentor?: Mentor;
  status: 'active' | 'inactive';
}

export interface Availability {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
}

export interface MentorshipSession {
  id: string;
  mentorId: string;
  menteeId: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  feedback?: {
    rating: number;
    comment: string;
  };
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
}

export interface MentorshipMatch {
  mentorId: string;
  menteeId: string;
  matchScore: number;
  commonInterests: string[];
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
} 