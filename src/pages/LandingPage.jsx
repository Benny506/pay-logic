import { Container, Row, Col, Nav, Navbar, Button, Card, Badge } from 'react-bootstrap'
import { motion } from 'motion/react'
import {
    HiOutlineChartPie,
    HiOutlineShieldCheck,
    HiOutlineLightningBolt,
    HiOutlineUserGroup,
    HiOutlineArrowNarrowRight,
    HiOutlineCurrencyDollar,
    HiOutlineDocumentReport,
    HiOutlineGlobe
} from 'react-icons/hi'
import { Link } from 'react-router-dom'

const LandingPage = () => {
    const scrollToSection = (id) => {
        const element = document.getElementById(id)
        if (element) {
            const offset = 80
            const bodyRect = document.body.getBoundingClientRect().top
            const elementRect = element.getBoundingClientRect().top
            const elementPosition = elementRect - bodyRect
            const offsetPosition = elementPosition - offset

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            })
        }
    }

    const NavItems = [
        { name: 'Features', id: 'features' },
        { name: 'How it Works', id: 'how-it-works' },
        { name: 'Analytics', id: 'analytics' },
        { name: 'About', id: 'about' }
    ]

    return (
        <div className="landing-page bg-midnight text-white overflow-hidden">
            {/* Navbar */}
            <Navbar expand="lg" variant="dark" fixed="top" className="glass-navbar py-3 border-0">
                <Container>
                    <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-3">
                        <div className="p-2 rounded-3 bg-emerald bg-opacity-10 d-inline-flex shadow-sm border border-emerald border-opacity-20">
                            <img src="/logo.png" alt="Logo" width="32" height="32" className="rounded-1" />
                        </div>
                        <span className="fs-3 fw-bold tracking-tight text-gradient">PayLogic</span>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="landing-nav" className="border-0 shadow-none" />
                    <Navbar.Collapse id="landing-nav">
                        <Nav className="ms-auto me-lg-4 gap-lg-3">
                            {NavItems.map((item) => (
                                <Nav.Link
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className="text-slate hover-emerald fw-medium cursor-pointer transition-all"
                                    style={{ '--hover-color': 'var(--primary-emerald)' }}
                                >
                                    {item.name}
                                </Nav.Link>
                            ))}
                        </Nav>
                        <Button as={Link} to="/dashboard" className="btn-emerald rounded-pill px-4 ms-lg-2">
                            Admin Dashboard
                        </Button>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Hero Section */}
            <section id="hero" className="min-vh-100 d-flex align-items-center pt-5 position-relative">
                <div className="bg-glow"></div>
                <Container className="pt-5 mt-5">
                    <Row className="align-items-center g-5">
                        <Col lg={6}>
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <Badge bg="primary" className="mb-4 px-3 py-2 rounded-pill bg-opacity-10 text-emerald fw-bold border-emerald border-opacity-10">
                                    <HiOutlineLightningBolt className="me-2" />
                                    The Future of Payroll Management
                                </Badge>
                                <h1 className="display-3 fw-extrabold mb-4 lh-sm">
                                    Precision Payroll <br />
                                    <span className="text-gradient">Automated.</span>
                                </h1>
                                <p className="lead text-slate mb-5 pe-lg-5">
                                    Experience the absolute precision of PayLogic. Streamline employee records, automate complex tax calculations, and gain deep departmental insights—all within a premium, high-speed administrative engine.
                                </p>
                                <div className="d-flex flex-wrap gap-3">
                                    <Button as={Link} to="/dashboard" className="btn-emerald rounded-pill px-5 py-3 fs-5 d-flex align-items-center gap-2">
                                        Get Started <HiOutlineArrowNarrowRight />
                                    </Button>
                                    <Button variant="outline-light" onClick={() => scrollToSection('features')} className="rounded-pill px-5 py-3 fs-5 border-white border-opacity-20 hover-lift">
                                        Explore Features
                                    </Button>
                                </div>
                            </motion.div>
                        </Col>
                        <Col lg={6}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                transition={{ duration: 1.2, ease: "easeOut" }}
                                className="ps-lg-5"
                            >
                                <div className="hero-illustration glass-card p-2 rounded-5 overflow-hidden shadow-2xl border-white border-opacity-5">
                                    <img
                                        src="/hero.png"
                                        alt="PayLogic Dashboard"
                                        className="img-fluid rounded-4 w-100"
                                    />
                                </div>
                            </motion.div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Features Section */}
            <section id="features" className="py-5 bg-midnight position-relative">
                <Container className="py-5">
                    <div className="text-center mb-5">
                        <h6 className="text-emerald fw-bold text-uppercase tracking-widest mb-3">Capabilities</h6>
                        <h2 className="display-4 fw-bold">Engineered for Accuracy</h2>
                        <p className="text-slate mx-auto" style={{ maxWidth: '600px' }}>
                            We've focused on the core pillars of payroll to build an engine that is both powerful and incredibly intuitive.
                        </p>
                    </div>
                    <Row className="g-4">
                        {[
                            { title: 'Smart Calculations', desc: 'Automated PAYE, Insurance, and deduction logic based on individual staff grades.', icon: <HiOutlineChartPie size={32} /> },
                            { title: 'Secure Vault', desc: 'Enterprise-grade encryption for all financial and banking records using Supabase Vault.', icon: <HiOutlineShieldCheck size={32} /> },
                            { title: 'Staff Analytics', desc: 'Real-time visualizations of spending trends and departmental performance hurdles.', icon: <HiOutlineDocumentReport size={32} /> },
                            { title: 'Global Directory', desc: 'Centralized management for diverse staff teams across multiple locations.', icon: <HiOutlineUserGroup size={32} /> },
                            { title: 'Instant Processing', desc: 'Execute entire payroll runs in seconds with our optimized processing logic.', icon: <HiOutlineLightningBolt size={32} /> },
                            { title: 'Cloud Sync', desc: 'Your data is always live and synced across all administrative sessions.', icon: <HiOutlineGlobe size={32} /> }
                        ].map((feature, i) => (
                            <Col lg={4} md={6} key={i}>
                                <motion.div
                                    whileHover={{ y: -10 }}
                                    className="h-100"
                                >
                                    <Card className="glass-card border-0 p-4 h-100 hover-lift bg-gradient-emerald">
                                        <div className="p-3 rounded-4 bg-emerald bg-opacity-10 text-emerald fit-content mb-4 shadow-sm">
                                            {feature.icon}
                                        </div>
                                        <h4 className="fw-bold mb-3">{feature.title}</h4>
                                        <p className="text-slate mb-0">{feature.desc}</p>
                                    </Card>
                                </motion.div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* How it Works Section */}
            <section id="how-it-works" className="py-5 bg-slate bg-opacity-25">
                <Container className="py-5 text-center">
                    <h2 className="display-5 fw-bold mb-5">Simplified Workflow</h2>
                    <Row className="g-5 justify-content-center">
                        {[
                            { step: '01', title: 'Onboard Staff', desc: 'Import or manually add staff records with secure bank and salary details.' },
                            { step: '02', title: 'Batch Run', desc: 'Initiate a monthly payroll run. Our engine handles the math instantly.' },
                            { step: '03', title: 'Verify & Send', desc: 'Review the generated payslips and confirm records for bank distribution.' }
                        ].map((step, i) => (
                            <Col md={4} key={i}>
                                <div className="p-4">
                                    <span className="display-1 fw-black text-white opacity-5 top-0 start-50 translate-middle-x mb-2">
                                        {step.step}
                                    </span>
                                    <div className="z-1">
                                        <h3 className="fw-bold mb-3">{step.title}</h3>
                                        <p className="text-slate">{step.desc}</p>
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* Analytics Section */}
            <section id="analytics" className="py-5 bg-midnight position-relative overflow-hidden">
                <Container className="py-5">
                    <Row className="align-items-center g-5">
                        <Col lg={6}>
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="display-4 fw-bold mb-4 text-gradient">Data-Driven Insights</h2>
                                <p className="lead text-slate mb-5">
                                    Stop guessing and start managing. PayLogic provides deep analytics into your departmental spending, helping you optimize budget allocations and track payroll growth over time.
                                </p>

                                <div className="analytics-carousel-container position-relative">
                                    <motion.div
                                        className="d-flex flex-column gap-4"
                                        animate={{ y: [0, -400, 0] }}
                                        transition={{
                                            duration: 20,
                                            repeat: Infinity,
                                            ease: "linear"
                                        }}
                                    >
                                        {[
                                            { title: "Cost Center Tracking", desc: "Real-time visibility into every department's financial footprint." },
                                            { title: "Trajectory Mapping", desc: "Forecast your payroll growth and prepare for scale with precision." },
                                            { title: "Budget Optimization", desc: "Identify redundancies and reallocate funds to high-impact teams." },
                                            { title: "Audit Transparency", desc: "Every transaction recorded and ready for compliance reporting." },
                                            // Duplicates for infinite effect
                                            { title: "Cost Center Tracking", desc: "Real-time visibility into every department's financial footprint." },
                                            { title: "Trajectory Mapping", desc: "Forecast your payroll growth and prepare for scale with precision." }
                                        ].map((item, i) => (
                                            <Card key={i} className="glass-card border-0 p-4 border-emerald border-opacity-10 shadow-sm">
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="p-2 rounded-3 bg-emerald bg-opacity-10 text-emerald">
                                                        <HiOutlineLightningBolt size={24} />
                                                    </div>
                                                    <div>
                                                        <h5 className="fw-bold mb-1 text-black">{item.title}</h5>
                                                        <p className="text-slate small mb-0">{item.desc}</p>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </motion.div>
                                    <div className="carousel-fade-top"></div>
                                    <div className="carousel-fade-bottom"></div>
                                </div>
                            </motion.div>
                        </Col>
                        <Col lg={6}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="ps-lg-5"
                            >
                                <div className="glass-card p-4 border-emerald border-opacity-10 shadow-2xl position-relative overflow-hidden">
                                    <div className="bg-glow-mini"></div>
                                    <div className="d-flex justify-content-between align-items-end mb-4 position-relative z-1">
                                        <div>
                                            <h5 className="mb-0 fw-bold">Departmental Breakdown</h5>
                                            <p className="text-slate small mb-0">Monthly distribution insights</p>
                                        </div>
                                        <Badge bg="emerald" className="bg-emerald bg-opacity-10 text-emerald border border-emerald border-opacity-20">Live Sync</Badge>
                                    </div>
                                    <div className="p-5 text-center bg-dark bg-opacity-20 rounded-4 border border-white border-opacity-5 position-relative z-1">
                                        <HiOutlineChartPie size={140} className="text-emerald opacity-50 mb-3 animate-pulse" />
                                        <h6 className="text-white fw-bold mb-1">Visual Intelligence Engine</h6>
                                        <p className="text-slate italic small mb-0">Active in administrative dashboard</p>
                                    </div>
                                </div>
                            </motion.div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* About Section */}
            <section id="about" className="py-5 bg-slate bg-opacity-10">
                <Container className="py-5">
                    <Row className="g-5 justify-content-center text-center">
                        <Col lg={8}>
                            <h2 className="display-4 fw-bold mb-4">Our Vision for Payroll</h2>
                            <p className="lead text-slate mb-5">
                                We believe that administrative overhead shouldn't stifle innovation. Our Mission is to provide small and medium enterprises with the same high-fidelity financial tools used by global corporations, wrapped in an intuitive, emerald-themed experience.
                            </p>
                            <Row className="g-4 text-start">
                                <Col md={6}>
                                    <Card className="glass-card border-0 p-4 h-100 shadow-sm border-emerald border-opacity-10">
                                        <h5 className="fw-bold mb-3 text-emerald">Precision First</h5>
                                        <p className="text-slate small mb-0">Every decimal place matters. Our engine is built on a foundation of absolute mathematical rigour and tax compliance.</p>
                                    </Card>
                                </Col>
                                <Col md={6}>
                                    <Card className="glass-card border-0 p-4 h-100 shadow-sm border-emerald border-opacity-10">
                                        <h5 className="fw-bold mb-3 text-emerald">Security by Default</h5>
                                        <p className="text-slate small mb-0">We leverage Supabase's military-grade encryption to ensure your staff data never leaves the secure vault.</p>
                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Footer */}
            <footer className="py-5 border-top border-white border-opacity-5">
                <Container>
                    <Row className="align-items-center">
                        <Col md={4} className="mb-4 mb-md-0">
                            <div className="d-flex align-items-center gap-2 mb-3">
                                <HiOutlineCurrencyDollar className="text-emerald" size={24} />
                                <span className="fs-4 fw-bold">PayLogic</span>
                            </div>
                            <p className="text-slate small pe-lg-5">
                                The ultimate administrative core for automated payroll and staff management. Precision you can trust.
                            </p>
                        </Col>
                        <Col md={8}>
                            <Row>
                                <Col sm={6} className="mb-4 mb-sm-0">
                                    <h6 className="fw-bold mb-3">Platform</h6>
                                    <Nav className="flex-column gap-2 small">
                                        <Nav.Link className="p-0 text-slate hover-emerald cursor-pointer" onClick={() => scrollToSection('hero')}>Home</Nav.Link>
                                        <Nav.Link className="p-0 text-slate hover-emerald cursor-pointer" onClick={() => scrollToSection('features')}>Features</Nav.Link>
                                        <Nav.Link className="p-0 text-slate hover-emerald cursor-pointer" onClick={() => scrollToSection('how-it-works')}>How it Works</Nav.Link>
                                    </Nav>
                                </Col>
                                <Col sm={6} className="mb-4 mb-sm-0">
                                    <h6 className="fw-bold mb-3">Company</h6>
                                    <Nav className="flex-column gap-2 small text-slate">
                                        <Nav.Link as="span" className="p-0 text-slate hover-emerald cursor-pointer" onClick={() => scrollToSection('about')}>About Us</Nav.Link>
                                        <Nav.Link as="span" className="p-0 text-slate hover-emerald cursor-pointer" onClick={() => scrollToSection('analytics')}>Analytics</Nav.Link>
                                    </Nav>
                                </Col>
                                {/* <Col sm={4}>
                                    <h6 className="fw-bold mb-3">Resources</h6>
                                    <div className="d-flex gap-3 text-slate">
                                        <HiOutlineGlobe size={24} className="cursor-pointer hover-emerald" title="Website" />
                                        <HiOutlineLightningBolt size={24} className="cursor-pointer hover-emerald" title="API Status" />
                                        <HiOutlineChartPie size={24} className="cursor-pointer hover-emerald" title="Market Data" />
                                    </div>
                                </Col> */}
                            </Row>
                        </Col>
                    </Row>
                    <div className="text-center pt-5 mt-4 border-top border-white border-opacity-5 text-slate smaller">
                        &copy; {new Date().getFullYear()} PayLogic Systems. All rights reserved.
                    </div>
                </Container>
            </footer>

            <style>
                {`
                    .hover-emerald:hover { color: var(--primary-emerald) !important; }
                    .bg-glow {
                        position: absolute;
                        top: 10%;
                        left: -10%;
                        width: 600px;
                        height: 600px;
                        background: radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%);
                        z-index: 0;
                        pointer-events: none;
                    }
                    .fw-black { font-weight: 900; }
                    .bg-glow-mini {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        width: 100%;
                        height: 100%;
                        background: radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 70%);
                        z-index: 0;
                    }
                    .analytics-carousel-container {
                        max-height: 380px;
                        overflow: hidden;
                        mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
                        -webkit-mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
                    }
                    .animate-pulse {
                        animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                    }
                    @keyframes pulse {
                        0%, 100% { opacity: 0.5; transform: scale(1); }
                        50% { opacity: 0.8; transform: scale(1.05); }
                    }
                `}
            </style>
        </div>
    )
}

export default LandingPage
