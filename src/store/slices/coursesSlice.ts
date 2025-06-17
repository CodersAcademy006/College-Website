import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiClient } from '@/services/api'

export interface Course {
  id: string
  name: string
  description: string
  instructor: string
  duration: string
  students: number
  status: 'active' | 'inactive'
}

interface CoursesState {
  courses: Course[]
  loading: boolean
  error: string | null
}

const initialState: CoursesState = {
  courses: [],
  loading: false,
  error: null
}

export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async () => {
    const response = await apiClient.get('/courses')
    return response.data
  }
)

export const deleteCourse = createAsyncThunk(
  'courses/deleteCourse',
  async (id: string) => {
    await apiClient.delete(`/courses/${id}`)
    return id
  }
)

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false
        state.courses = action.payload
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch courses'
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.courses = state.courses.filter(course => course.id !== action.payload)
      })
  }
})

export default coursesSlice.reducer 