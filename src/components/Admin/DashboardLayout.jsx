import Sidebar from './Sidebar'
import TopBar from './TopBar'
import { Container } from 'react-bootstrap'
import { motion, AnimatePresence } from 'motion/react'

const DashboardLayout = ({ children, title }) => {
  return (
    <div className="dashboard-wrapper min-vh-100 d-flex">
      {/* Sidebar fixed for desktop */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-grow-1 transition-all" style={{ marginLeft: '0', paddingLeft: '280px' }}>
        {/* Adjust margin-left for desktop vs mobile in CSS or inline */}
        <div className="content-container p-4 p-md-5">
          {/* We'll handle the responsive padding in index.css as well */}
          <style>
            {`
              @media (max-width: 991.98px) {
                main { padding-left: 0 !important; }
              }
            `}
          </style>
          
          <TopBar title={title} />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

export default DashboardLayout
