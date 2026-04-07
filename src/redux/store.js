import { configureStore } from '@reduxjs/toolkit'
import uiReducer from './uiSlice'
import employeeReducer from './employeeSlice'
import payrollReducer from './payrollSlice'
import authReducer from './authSlice'

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    employees: employeeReducer,
    payroll: payrollReducer,
    auth: authReducer
  }
})
