import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiClient } from '@/services/api'

export interface Student {
  id: string
  name: string
  email: string
  course: string
  status: 'active' | 'inactive'
}

interface StudentsState {
  students: Student[]
  loading: boolean
  error: string | null
}

const initialState: StudentsState = {
  students: [],
  loading: false,
  error: null
}

export const fetchStudents = createAsyncThunk(
  'students/fetchStudents',
  async () => {
    const response = await apiClient.get('/students')
    return response.data
  }
)

export const deleteStudent = createAsyncThunk(
  'students/deleteStudent',
  async (id: string) => {
    await apiClient.delete(`/students/${id}`)
    return id
  }
)

const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false
        state.students = action.payload
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch students'
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.students = state.students.filter(student => student.id !== action.payload)
      })
  }
})

export default studentsSlice.reducer 