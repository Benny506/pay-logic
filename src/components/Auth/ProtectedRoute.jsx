import { useSelector } from 'react-redux'
import Unauthorized from './Unauthorized'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, initChecked } = useSelector((state) => state.auth)

  // 1. Wait for initial session check to finish (Auto-Login)
  if (!initChecked) {
    return <div className="d-flex align-items-center justify-content-center vh-100 bg-midnight">
        <div className="p-4 glass-card border border-white border-opacity-10 text-center text-slate pulse">
            <small>Establishing Secure Session...</small>
        </div>
    </div>
  }

  // 2. Access control
  if (!isAuthenticated) {
    return <Unauthorized />
  }

  // 3. Authorized
  return children
}

export default ProtectedRoute
