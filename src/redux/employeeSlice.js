import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  list: [],
  selectedEmployee: null,
  payrollRuns: [],
  isLoading: false
}

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    setEmployees: (state, action) => {
      state.list = action.payload
    },
    setSelectedEmployee: (state, action) => {
      state.selectedEmployee = action.payload
    },
    addEmployee: (state, action) => {
      state.list.unshift(action.payload)
    },
    updateEmployeeInList: (state, action) => {
      const index = state.list.findIndex(e => e.id === action.payload.id)
      if (index !== -1) state.list[index] = action.payload
    },
    deleteEmployeeFromList: (state, action) => {
      state.list = state.list.filter(e => e.id !== action.payload)
    },
    setPayrollRuns: (state, action) => {
      state.payrollRuns = action.payload
    }
  }
})

export const { 
  setEmployees, 
  setSelectedEmployee, 
  addEmployee, 
  updateEmployeeInList, 
  deleteEmployeeFromList,
  setPayrollRuns 
} = employeeSlice.actions
export default employeeSlice.reducer
