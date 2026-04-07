import { motion } from 'motion/react'

const AnalyticsCard = ({ title, value, icon, trend, trendValue, prefix = "" }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-4 border border-white border-opacity-10 h-100 shadow-sm transition-all hover-lift"
            style={{ borderRadius: '24px' }}
        >
            <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="p-3 rounded-circle bg-emerald bg-opacity-10 text-emerald shadow-sm">
                    {icon}
                </div>
                {trend && (
                    <div className={`badge rounded-pill ${trend === 'up' ? 'bg-success' : 'bg-danger'} bg-opacity-10 ${trend === 'up' ? 'text-success' : 'text-danger'} px-3 py-2 fw-bold`}>
                        {trend === 'up' ? '↑' : '↓'} {trendValue}%
                    </div>
                )}
            </div>
            
            <div className="analytics-content">
                <p className="text-slate text-uppercase small fw-extrabold tracking-widest mb-1 opacity-75">
                    {title}
                </p>
                <h2 className="display-6 fw-extrabold text-white mb-0 mt-2">
                    <span className="smaller me-1 opacity-50">{prefix}</span>
                    {value}
                </h2>
            </div>
        </motion.div>
    )
}

export default AnalyticsCard
