import { useState } from 'react'
import { Container, Row, Col, Card, Form, Button, Carousel } from 'react-bootstrap'
import {
    HiOutlineMail,
    HiOutlineLockClosed,
    HiOutlineLogin,
    HiOutlineShieldCheck,
    HiOutlineLightBulb,
    HiOutlineDesktopComputer,
    HiOutlineSupport,
    HiOutlineArrowLeft,
    HiOutlineEye,
    HiOutlineEyeOff
} from 'react-icons/hi'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setGlobalLoading, addAlert } from '../redux/uiSlice'
import { signIn } from '../services/authService'
import { motion, AnimatePresence } from 'motion/react'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            dispatch(setGlobalLoading({ loading: true, title: 'Authenticating', message: 'Verifying administrative credentials...' }))
            await signIn(email, password)
            dispatch(addAlert({ type: 'success', message: 'Welcome back, Admin! Redirecting to dashboard...' }))
            navigate('/dashboard')
        } catch (error) {
            console.error("Login Error:", error)
            dispatch(addAlert({ type: 'error', message: 'Invalid credentials. Access denied.' }))
        } finally {
            dispatch(setGlobalLoading(false))
        }
    }

    const authTips = [
        {
            icon: <HiOutlineShieldCheck size={40} className="text-emerald" />,
            title: "Security & Protection",
            desc: "Always ensure your terminal is locked when leaving your station. PayLogic uses advanced encryption for all records.",
            items: ["Multi-Factor Ready", "Encrypted Transactions", "Audit Logs Active"]
        },
        {
            icon: <HiOutlineLightBulb size={40} className="text-emerald" />,
            title: "Performance Tip",
            desc: "Use the 'Departments' overview to identify staffing bottlenecks and balance your payroll budget efficiently.",
            items: ["Aggregated Metrics", "Resource Allocation", "Live Trends"]
        },
        {
            icon: <HiOutlineDesktopComputer size={40} className="text-emerald" />,
            title: "Dashboard Shortcuts",
            desc: "Review your monthly payroll in the 'Payroll History' before each run to ensure tax laws are updated.",
            items: ["Audit Support", "PDF Exports", "One-Click Processing"]
        }
    ]

    return (
        <div className="login-view d-flex align-items-center justify-content-center bg-midnight p-3">
            <Container>
                <Row className="justify-content-center">
                    <Col lg={10}>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card border border-white border-opacity-10 shadow-3xl"
                            style={{ borderRadius: '32px' }}
                        >
                            <Row className="g-0 min-vh-60">
                                {/* Left Side: Login Form */}
                                <Col lg={5} className="p-5 d-flex flex-column justify-content-center">
                                    <div className="d-flex justify-content-between align-items-center mb-5">
                                        <div className="brand d-flex align-items-center gap-2">
                                            <div className="p-2 bg-emerald bg-opacity-10 rounded-2">
                                                <img src="/logo.png" alt="Logo" width="24" height="24" />
                                            </div>
                                            <span className="fs-4 fw-bold text-white tracking-tight">PayLogic</span>
                                        </div>
                                        <Button 
                                            variant="link" 
                                            className="text-slate smaller text-decoration-none d-flex align-items-center gap-1 hover-emerald p-0"
                                            onClick={() => navigate('/')}
                                        >
                                            <HiOutlineArrowLeft size={14} />
                                            Back to Home
                                        </Button>
                                    </div>

                                    <h2 className="fw-extrabold text-white mb-2">Administrative Login</h2>
                                    <p className="text-slate mb-5">Access the core payroll management vault.</p>

                                    <Form onSubmit={handleLogin} className="mb-5">
                                        <Form.Group className="mb-4">
                                            <div className="d-flex align-items-center gap-2 mb-2">
                                                <HiOutlineMail className="text-emerald" />
                                                <Form.Label className="text-slate smaller fw-bold text-uppercase mb-0">Email Address</Form.Label>
                                            </div>
                                            <Form.Control
                                                required
                                                type="email"
                                                placeholder="admin@paylogic.com"
                                                className="bg-midnight text-white border-white border-opacity-10 py-3 rounded-4 focus-emerald"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-5">
                                            <div className="d-flex align-items-center gap-2 mb-2">
                                                <HiOutlineLockClosed className="text-emerald" />
                                                <Form.Label className="text-slate smaller fw-bold text-uppercase mb-0">Password</Form.Label>
                                            </div>
                                            <div className="position-relative">
                                                <Form.Control
                                                    required
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="••••••••"
                                                    className="bg-midnight text-white border-white border-opacity-10 py-3 rounded-4 focus-emerald pe-5"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />
                                                <Button 
                                                    variant="link" 
                                                    className="position-absolute end-0 top-50 translate-middle-y text-slate hover-emerald me-2 p-1"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    type="button"
                                                >
                                                    {showPassword ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
                                                </Button>
                                            </div>
                                        </Form.Group>

                                        <Button className="btn-emerald w-100 py-3 rounded-pill fw-extrabold d-flex align-items-center justify-content-center gap-2 shadow-lg" type="submit">
                                            Open Secure Vault
                                            <HiOutlineLogin size={20} />
                                        </Button>
                                    </Form>

                                    <div className="mt-auto pt-4 border-top border-white border-opacity-5">
                                        <div className="d-flex align-items-center gap-3 text-slate">
                                            <div className="p-2 bg-white bg-opacity-5 rounded-circle">
                                                <HiOutlineSupport />
                                            </div>
                                            <div>
                                                <p className="smaller fw-bold mb-0">Recover Account?</p>
                                                <small className="opacity-75">Please contact the Tech Department for a password reset.</small>
                                            </div>
                                        </div>
                                    </div>
                                </Col>

                                {/* Right Side: AuthTips Carousel */}
                                <Col lg={7} className="d-none d-lg-block bg-white bg-opacity-5 p-5 position-relative border-start border-white border-opacity-5">
                                    <div className="h-100 d-flex flex-column justify-content-center">
                                        <Carousel controls={false} indicators={true} interval={5000} className="auth-tips-carousel h-100">
                                            {authTips.map((tip, i) => (
                                                <Carousel.Item key={i} className="h-100">
                                                    <div className="p-4 h-100 d-flex flex-column justify-content-center">
                                                        <div className="p-4 bg-emerald bg-opacity-10 d-inline-block rounded-4 mb-4 shadow-sm border border-emerald border-opacity-10 align-self-start">
                                                            {tip.icon}
                                                        </div>
                                                        <h1 className="fw-extrabold text-black mb-4 display-5">{tip.title}</h1>
                                                        <p className="text-slate fs-5 leading-relaxed mb-5 opacity-90">{tip.desc}</p>

                                                        <div className="d-flex flex-column gap-3">
                                                            {tip.items.map((item, idx) => (
                                                                <div key={idx} className="d-flex align-items-center gap-3 p-3 bg-white bg-opacity-5 rounded-4 border border-white border-opacity-5 hover-lift">
                                                                    <div style={{ width: '1px', height: '1px', backgroundColor: '#12B981' }} className="p-1 bg-emerald rounded-circle"></div>
                                                                    <span className="text-black fw-bold small">{item}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </Carousel.Item>
                                            ))}
                                        </Carousel>
                                    </div>
                                </Col>
                            </Row>
                        </motion.div>
                    </Col>
                </Row>
            </Container>

            <style>
                {`
                    .focus-emerald:focus {
                        border-color: var(--primary-emerald) !important;
                        box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1) !important;
                    }
                    .auth-tips-carousel .carousel-indicators {
                        justify-content: flex-start;
                        margin-bottom: 0px;
                        margin-left: 2rem;
                    }
                    .auth-tips-carousel .carousel-indicators [data-bs-target] {
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        background-color: var(--primary-emerald);
                        opacity: 0.3;
                    }
                    .auth-tips-carousel .carousel-indicators .active {
                        opacity: 1;
                        width: 30px;
                        border-radius: 10px;
                    }
                `}
            </style>
        </div>
    )
}

export default Login
