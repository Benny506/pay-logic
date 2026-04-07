import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    history: [],
    activeRun: null,
    loading: false,
    error: null
}

const payrollSlice = createSlice({
    name: 'payroll',
    initialState,
    reducers: {
        setHistory: (state, action) => {
            state.history = action.payload
        },
        addPayrollRun: (state, action) => {
            state.history.unshift(action.payload)
        },
        setPayrollLoading: (state, action) => {
            state.loading = action.payload
        },
        setPayrollError: (state, action) => {
            state.error = action.payload
        }
    }
})

export const { setHistory, addPayrollRun, setPayrollLoading, setPayrollError } = payrollSlice.actions
export default payrollSlice.reducer
