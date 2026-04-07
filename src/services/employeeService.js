import { supabase } from '../../supabase/supabaseClient'

/**
 * Service for interacting with the 'pay_employees' table.
 */
export const fetchEmployees = async () => {
    const { data, error } = await supabase
        .from('pay_employees')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) throw error
    return data
}

export const addEmployee = async (employeeData) => {
    const { data, error } = await supabase
        .from('pay_employees')
        .insert([employeeData])
        .select()

    if (error) throw error
    return data[0]
}

export const updateEmployee = async (id, updates) => {
    const { data, error } = await supabase
        .from('pay_employees')
        .update(updates)
        .eq('id', id)
        .select()

    if (error) throw error
    return data[0]
}

export const deleteEmployee = async (id) => {
    const { error } = await supabase
        .from('pay_employees')
        .delete()
        .eq('id', id)

    if (error) throw error
    return true
}

export const subscribeToEmployees = (onUpdate) => {
    return supabase
        .channel('pay_employees_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'pay_employees' }, onUpdate)
        .subscribe()
}
