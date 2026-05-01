import { supabase } from '../../supabase/supabaseClient'

/**
 * Payroll Calculation Logic (10/5/5 Model)
 * Tax: 10%, Insurance: 5%, Pension: 5%
 */
export const calculateDeductions = (baseSalary) => {
    const gross = parseFloat(baseSalary)
    const tax = gross * 0.10
    const insurance = gross * 0.05
    const pension = gross * 0.05
    const net = gross - (tax + insurance + pension)

    return {
        gross_pay: gross,
        tax_deduction: tax,
        insurance_deduction: insurance,
        pension_deduction: pension,
        net_pay: net
    }
}

/**
 * Service for interacting with 'pay_payroll_runs' and 'pay_transactions'
 */
export const fetchPayrollHistory = async () => {
    const { data, error } = await supabase
        .from('pay_payroll_runs')
        .select('*')
        .order('year', { ascending: false })
        .order('month', { ascending: false })

    if (error) throw error
    return data
}

/**
 * Fetch individual transactions with staff names for a specific run
 */
export const fetchRunTransactions = async (runId) => {
    const { data, error } = await supabase
        .from('pay_transactions')
        .select(`
            *,
            pay_employees (
                full_name
            )
        `)
        .eq('run_id', runId)

    if (error) throw error
    return data
}

export const createPayrollRun = async (month, year, employees) => {
    // 1. Calculate the total payout based on Net Pay
    const detailedTransactions = employees.map(emp => ({
        employee_id: emp.id,
        ...calculateDeductions(emp.base_salary),
        month,
        year
    }))

    const totalPayout = detailedTransactions.reduce((sum, t) => sum + t.net_pay, 0)

    // 2. Create the Payroll Run record
    const { data: runData, error: runError } = await supabase
        .from('pay_payroll_runs')
        .insert([{
            month,
            year,
            total_payout: totalPayout,
            status: 'Completed' // Automating the completion for this demo
        }])
        .select()

    if (runError) throw runError
    const runId = runData[0].id

    // 3. Insert individual transactions
    const transactionsToInsert = detailedTransactions.map(t => ({
        ...t,
        run_id: runId
    }))

    const { error: transError } = await supabase
        .from('pay_transactions')
        .insert(transactionsToInsert)

    if (transError) throw transError

    return runData[0]
}

/**
 * Fetch all payroll transactions for a specific employee
 */
export const fetchEmployeePayrollHistory = async (employeeId) => {
    const { data, error } = await supabase
        .from('pay_transactions')
        .select('*')
        .eq('employee_id', employeeId)
        .order('year', { ascending: false })
        .order('month', { ascending: false })

    if (error) throw error
    return data
}
