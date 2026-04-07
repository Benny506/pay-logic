import { useSelector } from 'react-redux'
import { AnimatePresence } from 'motion/react'
import Alert from './Alert'

const GlobalAlerts = () => {
    const alerts = useSelector((state) => state.ui.alerts)

    return (
        <div 
            className="position-fixed top-0 end-0 p-4" 
            style={{ 
                zIndex: 11000, 
                maxHeight: '100vh', 
                overflowY: 'auto' 
            }}
        >
            <AnimatePresence mode="popLayout">
                {alerts.map((alert) => (
                    <Alert key={alert.id} alert={alert} />
                ))}
            </AnimatePresence>
        </div>
    )
}

export default GlobalAlerts
