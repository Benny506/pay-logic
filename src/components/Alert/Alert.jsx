import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { useDispatch } from 'react-redux'
import { removeAlert } from '../../redux/uiSlice'
import { 
    HiCheckCircle, 
    HiXCircle, 
    HiInformationCircle, 
    HiExclamation 
} from 'react-icons/hi'

const Alert = ({ alert }) => {
    const dispatch = useDispatch()
    const [isExiting, setIsExiting] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true)
            dispatch(removeAlert(alert.id))
        }, alert.duration || 5000)

        return () => clearTimeout(timer)
    }, [alert.id, alert.duration, dispatch])

    const getAlertConfig = () => {
        switch (alert.type) {
            case 'success':
                return {
                    icon: <HiCheckCircle className="fs-4 text-emerald" />,
                    bg: 'bg-midnight border-emerald border-opacity-40 shadow-emerald',
                    progress: 'bg-emerald'
                }
            case 'error':
                return {
                    icon: <HiXCircle className="fs-4 text-danger" />,
                    bg: 'bg-midnight border-danger border-opacity-40 shadow-danger',
                    progress: 'bg-danger'
                }
            case 'warning':
                return {
                    icon: <HiExclamation className="fs-4 text-warning" />,
                    bg: 'bg-midnight border-warning border-opacity-40 shadow-warning',
                    progress: 'bg-warning'
                }
            default:
                return {
                    icon: <HiInformationCircle className="fs-4 text-info" />,
                    bg: 'bg-midnight border-info border-opacity-40 shadow-info',
                    progress: 'bg-info'
                }
        }
    }

    const config = getAlertConfig()

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`p-3 mb-3 d-flex align-items-center gap-3 border ${config.bg}`}
            style={{ 
                minWidth: '320px', 
                maxWidth: '450px',
                borderRadius: '16px',
                position: 'relative' // Ensure progress bar attaches correctly
            }}
        >
            <div className="flex-shrink-0">
                {config.icon}
            </div>
            
            <div className="flex-grow-1">
                <p className="m-0 text-white fw-bold small opacity-90">{alert.message}</p>
            </div>

            {/* Progress Bar (Self-Dismissing Indicator) */}
            <div 
                className="position-absolute bottom-0 start-0 w-100 overflow-hidden" 
                style={{ height: '3px', borderRadius: '0 0 16px 16px' }}
            >
                <motion.div
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: (alert.duration || 5000) / 1000, ease: 'linear' }}
                    className={`h-100 ${config.progress}`}
                    style={{ opacity: 0.6 }}
                />
            </div>

            {/* Manual Close Button */}
            <button 
                onClick={() => dispatch(removeAlert(alert.id))}
                className="btn-close btn-close-white smaller opacity-50 hover-opacity-100"
                style={{ filter: 'none' }}
                aria-label="Close"
            />
        </motion.div>
    )
}

export default Alert
