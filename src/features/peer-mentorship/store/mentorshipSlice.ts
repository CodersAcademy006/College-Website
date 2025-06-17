import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mentorshipService } from '../services/mentorshipService';
import {
  Mentor,
  Mentee,
  MentorshipSession,
  ChatMessage,
  MentorshipMatch,
  Availability
} from '../types';

interface MentorshipState {
  mentors: Mentor[];
  mentees: Mentee[];
  sessions: MentorshipSession[];
  messages: ChatMessage[];
  matches: MentorshipMatch[];
  loading: boolean;
  error: string | null;
}

const initialState: MentorshipState = {
  mentors: [],
  mentees: [],
  sessions: [],
  messages: [],
  matches: [],
  loading: false,
  error: null
};

// Async thunks
export const fetchMentors = createAsyncThunk(
  'mentorship/fetchMentors',
  async () => {
    return await mentorshipService.getMentors();
  }
);

export const fetchMentees = createAsyncThunk(
  'mentorship/fetchMentees',
  async () => {
    return await mentorshipService.getMentees();
  }
);

export const fetchSessions = createAsyncThunk(
  'mentorship/fetchSessions',
  async (userId: string) => {
    return await mentorshipService.getSessions(userId);
  }
);

export const fetchMessages = createAsyncThunk(
  'mentorship/fetchMessages',
  async ({ userId, otherUserId }: { userId: string; otherUserId: string }) => {
    return await mentorshipService.getMessages(userId, otherUserId);
  }
);

export const fetchMatches = createAsyncThunk(
  'mentorship/fetchMatches',
  async (userId: string) => {
    return await mentorshipService.findMatches(userId);
  }
);

export const updateMentorAvailability = createAsyncThunk(
  'mentorship/updateMentorAvailability',
  async ({ id, availability }: { id: string; availability: Availability[] }) => {
    return await mentorshipService.updateMentorAvailability(id, availability);
  }
);

export const createSession = createAsyncThunk(
  'mentorship/createSession',
  async (session: Omit<MentorshipSession, 'id'>) => {
    return await mentorshipService.createSession(session);
  }
);

export const updateSession = createAsyncThunk(
  'mentorship/updateSession',
  async ({ id, session }: { id: string; session: Partial<MentorshipSession> }) => {
    return await mentorshipService.updateSession(id, session);
  }
);

export const sendMessage = createAsyncThunk(
  'mentorship/sendMessage',
  async (message: Omit<ChatMessage, 'id' | 'timestamp' | 'status'>) => {
    return await mentorshipService.sendMessage(message);
  }
);

export const acceptMatch = createAsyncThunk(
  'mentorship/acceptMatch',
  async (matchId: string) => {
    return await mentorshipService.acceptMatch(matchId);
  }
);

export const rejectMatch = createAsyncThunk(
  'mentorship/rejectMatch',
  async (matchId: string) => {
    return await mentorshipService.rejectMatch(matchId);
  }
);

const mentorshipSlice = createSlice({
  name: 'mentorship',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Mentors
      .addCase(fetchMentors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMentors.fulfilled, (state, action) => {
        state.loading = false;
        state.mentors = action.payload;
      })
      .addCase(fetchMentors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch mentors';
      })
      // Fetch Mentees
      .addCase(fetchMentees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMentees.fulfilled, (state, action) => {
        state.loading = false;
        state.mentees = action.payload;
      })
      .addCase(fetchMentees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch mentees';
      })
      // Fetch Sessions
      .addCase(fetchSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSessions.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions = action.payload;
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch sessions';
      })
      // Fetch Messages
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch messages';
      })
      // Fetch Matches
      .addCase(fetchMatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.loading = false;
        state.matches = action.payload;
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch matches';
      })
      // Update Mentor Availability
      .addCase(updateMentorAvailability.fulfilled, (state, action) => {
        const index = state.mentors.findIndex(m => m.id === action.payload.id);
        if (index !== -1) {
          state.mentors[index] = action.payload;
        }
      })
      // Create Session
      .addCase(createSession.fulfilled, (state, action) => {
        state.sessions.push(action.payload);
      })
      // Update Session
      .addCase(updateSession.fulfilled, (state, action) => {
        const index = state.sessions.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.sessions[index] = action.payload;
        }
      })
      // Send Message
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      })
      // Accept Match
      .addCase(acceptMatch.fulfilled, (state, action) => {
        const index = state.matches.findIndex(m => m.mentorId === action.payload.mentorId && m.menteeId === action.payload.menteeId);
        if (index !== -1) {
          state.matches[index] = action.payload;
        }
      })
      // Reject Match
      .addCase(rejectMatch.fulfilled, (state, action) => {
        const index = state.matches.findIndex(m => m.mentorId === action.payload.mentorId && m.menteeId === action.payload.menteeId);
        if (index !== -1) {
          state.matches[index] = action.payload;
        }
      });
  }
});

export const { clearError } = mentorshipSlice.actions;
export default mentorshipSlice.reducer; 