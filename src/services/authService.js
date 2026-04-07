import { supabase } from '../../supabase/supabaseClient'
import { loginSuccess, logout, setInitChecked } from '../redux/authSlice'

/**
 * Sign in using email and password
 */
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) throw error
  return data
}

/**
 * Sign out of the session
 */
export const signOutService = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

/**
 * Initialize Auth Session for Auto-Login
 */
export const initAuth = (dispatch) => {
  // 1. Initial Check
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session) {
      dispatch(loginSuccess(session.user))
    } else {
      dispatch(setInitChecked(true))
    }
  })

  // 2. Listen for Auth Changes (Sign In, Sign Out, Refresh)
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    if (session) {
      dispatch(loginSuccess(session.user))
    } else {
      dispatch(logout())
    }
  })

  return subscription
}
