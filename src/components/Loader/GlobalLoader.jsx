import { motion } from 'motion/react'
import { useSelector } from 'react-redux'

const GlobalLoader = () => {
    const title = useSelector((state) => state.ui.globalLoadingTitle)
    const message = useSelector((state) => state.ui.globalLoadingMessage)

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center"
            style={{
                background: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                zIndex: 10000,
                pointerEvents: 'all'
            }}
        >
            <div className="position-relative mb-5">
                {/* Emerald Atmospheric Rings */}
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="position-absolute start-50 top-50 translate-middle border border-emerald border-opacity-10 rounded-circle"
                        style={{ width: 150, height: 150 }}
                        animate={{
                            scale: [1, 2.5],
                            opacity: [0.15, 0]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: i * 1,
                            ease: "easeInOut"
                        }}
                    />
                ))}

                {/* Core Pulsing Glow */}
                <motion.div
                    className="position-absolute start-50 top-50 translate-middle bg-emerald bg-opacity-10 rounded-circle shadow-2xl"
                    style={{ width: 180, height: 180, filter: 'blur(30px)' }}
                    animate={{
                        scale: [0.8, 1.2, 0.8],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />

                {/* Logo Frame */}
                <motion.div
                    animate={{
                        rotate: [0, 360],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="position-absolute start-50 top-50 translate-middle border border-emerald border-opacity-20 rounded-circle"
                    style={{ width: 110, height: 110, borderStyle: 'dashed' }}
                />

                {/* Central Logo (PL) */}
                <motion.div
                    animate={{
                        y: [-5, 5, -5]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="position-relative glass-card d-flex align-items-center justify-content-center shadow-2xl border-emerald border-opacity-30"
                    style={{ width: 90, height: 90, borderRadius: '24px' }}
                >
                    <span className="text-gradient fw-extrabold display-6 m-0" style={{ letterSpacing: '-2px' }}>
                        PL
                    </span>
                </motion.div>
            </div>

            {/* Status Information */}
            <div className="text-center px-4">
                <motion.h2
                    key={title}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fw-extrabold text-white mb-2 tracking-tight"
                    style={{ fontSize: '1.75rem' }}
                >
                    {title}
                </motion.h2>

                <motion.p
                    key={message}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-slate opacity-75 small text-uppercase fw-bold tracking-widest"
                >
                    {message}
                </motion.p>
            </div>

            {/* Bottom Accent Bar */}
            <div className="position-absolute bottom-0 start-0 w-100 overflow-hidden" style={{ height: '3px' }}>
                <motion.div
                    className="h-100 bg-emerald"
                    animate={{
                        x: ['-100%', '100%']
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{ width: '40%', opacity: 0.5 }}
                />
            </div>
        </motion.div>
    )
}

export default GlobalLoader
