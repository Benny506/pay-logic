import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  globalLoading: false,
  globalLoadingTitle: 'Loading',
  globalLoadingMessage: 'Please wait a moment...',
  sidebarOpen: true,
  alerts: []
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setGlobalLoading: (state, action) => {
      if (typeof action.payload === 'boolean') {
        state.globalLoading = action.payload
      } else {
        state.globalLoading = action.payload.loading
        state.globalLoadingTitle = action.payload.title || 'Loading'
        state.globalLoadingMessage = action.payload.message || 'Please wait a moment...'
      }
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    addAlert: (state, action) => {
      const { type, message, duration = 5000 } = action.payload
      state.alerts.push({
        id: Date.now(),
        type: type || 'info', // success, error, info, warning
        message: message || '',
        duration
      })
    },
    removeAlert: (state, action) => {
      state.alerts = state.alerts.filter(a => a.id !== action.payload)
    },
    clearAlerts: (state) => {
      state.alerts = []
    }
  }
})

export const { setGlobalLoading, toggleSidebar, addAlert, removeAlert, clearAlerts } = uiSlice.actions
export default uiSlice.reducer
