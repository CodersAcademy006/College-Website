import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { learningPathService } from '../services/learningPathService';
import { LearningPath, CourseRecommendation, MaterialRecommendation } from '../types';

interface AdaptiveLearningState {
  learningPath: LearningPath | null;
  courseRecommendations: CourseRecommendation[];
  materialRecommendations: MaterialRecommendation[];
  loading: boolean;
  error: string | null;
}

const initialState: AdaptiveLearningState = {
  learningPath: null,
  courseRecommendations: [],
  materialRecommendations: [],
  loading: false,
  error: null
};

export const fetchLearningPath = createAsyncThunk(
  'adaptiveLearning/fetchLearningPath',
  async (studentId: string) => {
    return await learningPathService.getLearningPath(studentId);
  }
);

export const fetchCourseRecommendations = createAsyncThunk(
  'adaptiveLearning/fetchCourseRecommendations',
  async (studentId: string) => {
    return await learningPathService.getCourseRecommendations(studentId);
  }
);

export const fetchMaterialRecommendations = createAsyncThunk(
  'adaptiveLearning/fetchMaterialRecommendations',
  async (studentId: string) => {
    return await learningPathService.getMaterialRecommendations(studentId);
  }
);

export const calculateLearningPath = createAsyncThunk(
  'adaptiveLearning/calculateLearningPath',
  async (studentId: string) => {
    return await learningPathService.calculateLearningPath(studentId);
  }
);

const adaptiveLearningSlice = createSlice({
  name: 'adaptiveLearning',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Learning Path
      .addCase(fetchLearningPath.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLearningPath.fulfilled, (state, action) => {
        state.loading = false;
        state.learningPath = action.payload;
      })
      .addCase(fetchLearningPath.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch learning path';
      })
      // Fetch Course Recommendations
      .addCase(fetchCourseRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseRecommendations.fulfilled, (state, action) => {
        state.loading = false;
        state.courseRecommendations = action.payload;
      })
      .addCase(fetchCourseRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch course recommendations';
      })
      // Fetch Material Recommendations
      .addCase(fetchMaterialRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMaterialRecommendations.fulfilled, (state, action) => {
        state.loading = false;
        state.materialRecommendations = action.payload;
      })
      .addCase(fetchMaterialRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch material recommendations';
      })
      // Calculate Learning Path
      .addCase(calculateLearningPath.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(calculateLearningPath.fulfilled, (state, action) => {
        state.loading = false;
        state.learningPath = action.payload;
      })
      .addCase(calculateLearningPath.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to calculate learning path';
      });
  }
});

export default adaptiveLearningSlice.reducer; 