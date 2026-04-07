import { Container, Button } from 'react-bootstrap'
import { HiOutlineLockClosed, HiOutlineArrowLeft } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'

const Unauthorized = () => {
    const navigate = useNavigate()

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '70vh' }}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-5 text-center border border-white border-opacity-10 shadow-2xl"
                style={{ maxWidth: '500px', borderRadius: '32px' }}
            >
                <div className="mb-4 d-inline-block p-4 rounded-circle bg-danger bg-opacity-10 text-danger shadow-sm">
                    <HiOutlineLockClosed size={48} />
                </div>
                
                <h2 className="fw-extrabold text-white mb-3">Access Restricted</h2>
                <p className="text-slate mb-5 leading-relaxed">
                    You are attempting to access a secure administrative area. Please sign in with authorized credentials to continue.
                </p>

                <div className="d-grid gap-3">
                    <Button 
                        className="btn-emerald py-3 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2 shadow-lg"
                        onClick={() => navigate('/login')}
                    >
                        Sign In Now
                    </Button>
                    <Button 
                        variant="outline-light" 
                        className="py-3 rounded-pill fw-bold border-opacity-20 d-flex align-items-center justify-content-center gap-2"
                        onClick={() => navigate('/')}
                    >
                        <HiOutlineArrowLeft />
                        Back to Landing
                    </Button>
                </div>

                <div className="mt-5 p-3 rounded-4 bg-white bg-opacity-5 border border-white border-opacity-5">
                    <small className="text-slate uppercase tracking-widest fw-bold smaller">Security Protocol v4.2</small>
                </div>
            </motion.div>
        </Container>
    )
}

export default Unauthorized
