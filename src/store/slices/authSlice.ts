import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiClient } from '@/services/api'
import { User, AuthTokens } from '@/contexts/AuthContext'

interface AuthState {
  user: User | null
  tokens: AuthTokens | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: AuthState = {
  user: null,
  tokens: null,
  status: 'idle',
  error: null,
}

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    const response = await apiClient.post('/auth/login', { email, password })
    return response.data
  }
)

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (refreshToken: string) => {
    const response = await apiClient.post('/auth/refresh', { refreshToken })
    return response.data
  }
)

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.tokens = null
      state.status = 'idle'
      state.error = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        state.tokens = action.payload.tokens
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Login failed'
      })
      // Refresh token
      .addCase(refreshToken.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.tokens = action.payload.tokens
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Token refresh failed'
        state.user = null
        state.tokens = null
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer 