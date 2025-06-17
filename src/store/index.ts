import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import authReducer from './slices/authSlice'
import studentsReducer from './slices/studentsSlice'
import coursesReducer from './slices/coursesSlice'
import uiReducer from './slices/uiSlice'
import dashboardReducer from './slices/dashboardSlice'
import adaptiveLearningReducer from '@/features/adaptive-learning/store/adaptiveLearningSlice'
import mentorshipReducer from '@/features/peer-mentorship/store/mentorshipSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    students: studentsReducer,
    courses: coursesReducer,
    ui: uiReducer,
    dashboard: dashboardReducer,
    adaptiveLearning: adaptiveLearningReducer,
    mentorship: mentorshipReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/loginSuccess', 'auth/refreshTokenSuccess'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.tokens'],
        // Ignore these paths in the state
        ignoredPaths: ['auth.tokens'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector 