import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiClient } from '@/services/api'

export interface DashboardStats {
  totalStudents: number
  totalCourses: number
  attendanceRate: number
  performanceRate: number
  studentGrowth: number
  courseGrowth: number
  attendanceGrowth: number
  performanceGrowth: number
  enrollmentData: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      borderColor: string
      backgroundColor: string
    }[]
  }
  courseDistribution: {
    labels: string[]
    datasets: {
      data: number[]
      backgroundColor: string[]
    }[]
  }
  recentActivities: {
    icon: React.ReactNode
    iconBg: string
    title: string
    time: string
  }[]
  quickActions: {
    icon: React.ReactNode
    title: string
  }[]
}

interface DashboardState {
  stats: DashboardStats
  loading: boolean
  error: string | null
}

const initialState: DashboardState = {
  stats: {
    totalStudents: 0,
    totalCourses: 0,
    attendanceRate: 0,
    performanceRate: 0,
    studentGrowth: 0,
    courseGrowth: 0,
    attendanceGrowth: 0,
    performanceGrowth: 0,
    enrollmentData: {
      labels: [],
      datasets: []
    },
    courseDistribution: {
      labels: [],
      datasets: []
    },
    recentActivities: [],
    quickActions: []
  },
  loading: false,
  error: null
}

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async () => {
    const response = await apiClient.get('/dashboard/stats')
    return response.data
  }
)

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false
        state.stats = action.payload
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch dashboard stats'
      })
  }
})

export default dashboardSlice.reducer 