import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  initChecked: false // To prevent "Unauthorized" flicker on refresh
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthLoading: (state, action) => {
      state.loading = action.payload
    },
    loginSuccess: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = true
      state.loading = false
      state.initChecked = true
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.loading = false
      state.initChecked = true
    },
    setInitChecked: (state, action) => {
      state.initChecked = action.payload
    }
  }
})

export const { setAuthLoading, loginSuccess, logout, setInitChecked } = authSlice.actions
export default authSlice.reducer
