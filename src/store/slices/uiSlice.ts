import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

interface UIState {
  sidebarOpen: boolean
  modals: {
    [key: string]: boolean
  }
  toasts: Toast[]
  theme: 'light' | 'dark'
}

const initialState: UIState = {
  sidebarOpen: true,
  modals: {},
  toasts: [],
  theme: 'light',
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
    openModal: (state, action: PayloadAction<string>) => {
      state.modals[action.payload] = true
    },
    closeModal: (state, action: PayloadAction<string>) => {
      state.modals[action.payload] = false
    },
    closeAllModals: (state) => {
      state.modals = {}
    },
    addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
      const id = Math.random().toString(36).substring(7)
      state.toasts.push({ ...action.payload, id })
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload)
    },
    clearToasts: (state) => {
      state.toasts = []
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', state.theme)
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload
      localStorage.setItem('theme', action.payload)
    },
  },
})

export const {
  toggleSidebar,
  setSidebarOpen,
  openModal,
  closeModal,
  closeAllModals,
  addToast,
  removeToast,
  clearToasts,
  toggleTheme,
  setTheme,
} = uiSlice.actions

export default uiSlice.reducer 