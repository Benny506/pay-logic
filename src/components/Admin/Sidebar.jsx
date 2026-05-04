import { Nav, Button, Offcanvas } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import { HiOutlineUsers, HiOutlineCurrencyDollar, HiOutlineChartPie, HiOutlineCog, HiOutlineLogout, HiOutlineOfficeBuilding, HiOutlineArrowCircleLeft, HiOutlineMailOpen } from 'react-icons/hi'
import { useSelector, useDispatch } from 'react-redux'
import { toggleSidebar } from '../../redux/uiSlice'
import { signOutService } from '../../services/authService'
import { useNavigate } from 'react-router-dom'

const Sidebar = () => {
  const location = useLocation()
  const { sidebarOpen } = useSelector((state) => state.ui)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await signOutService()
      navigate('/login')
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <HiOutlineChartPie size={20} /> },
    { name: 'Staff Directory', path: '/staff', icon: <HiOutlineUsers size={20} /> },
    { name: 'Departments', path: '/departments', icon: <HiOutlineOfficeBuilding size={20} /> },
    { name: 'Payroll Run', path: '/payroll', icon: <HiOutlineCurrencyDollar size={20} /> },
    { name: 'Bulk Email', path: '/bulk-email', icon: <HiOutlineMailOpen size={20} /> },
    // { name: 'Settings', path: '/settings', icon: <HiOutlineCog size={20} /> },
  ]

  const SidebarContent = () => (
    <div className="d-flex flex-column h-100 p-4">
      <div className="brand-section mb-5 d-flex align-items-center gap-3">
        <div className="p-2 rounded-3 bg-emerald bg-opacity-10 d-flex shadow-sm border border-emerald border-opacity-20">
          <img src="/logo.png" alt="Logo" width="28" height="28" className="rounded-1" />
        </div>
        <span className="fs-4 fw-bold text-gradient tracking-tight">PayLogic</span>
      </div>

      <Nav className="flex-column gap-2 flex-grow-1">
        {navItems.map((item) => (
          <Nav.Link
            key={item.path}
            as={Link}
            to={item.path}
            className={`d-flex align-items-center gap-3 px-3 py-3 rounded-4 transition-all ${location.pathname === item.path ? 'bg-primary bg-opacity-10 text-emerald fw-bold' : 'text-slate'
              }`}
            style={{
              color: location.pathname === item.path ? 'var(--primary-emerald)' : 'var(--text-slate)',
              backgroundColor: location.pathname === item.path ? 'var(--primary-glow)' : 'transparent'
            }}
          >
            {item.icon}
            <span>{item.name}</span>
          </Nav.Link>
        ))}
      </Nav>

      <div className="mt-auto">
        <Nav.Link
          as={Link}
          to="/"
          className="d-flex align-items-center gap-3 px-3 py-3 rounded-4 text-slate hover-emerald mb-2 transition-all"
        >
          <HiOutlineArrowCircleLeft size={20} />
          <span>Back to Website</span>
        </Nav.Link>
        <Button
          variant="link"
          className="text-danger d-flex align-items-center gap-3 px-3 py-3 text-decoration-none w-100 hover-lift"
          onClick={handleLogout}
        >
          <HiOutlineLogout size={20} />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="d-none d-lg-block border-end border-white border-opacity-5 h-100 transition-all overflow-hidden bg-midnight" style={{ width: '280px', position: 'fixed', left: 0, top: 0, bottom: 0 }}>
        <SidebarContent />
      </div>

      {/* Mobile/Tablet Offcanvas */}
      <Offcanvas show={!sidebarOpen} onHide={() => dispatch(toggleSidebar())} className="bg-slate text-white glass-card" style={{ backgroundColor: 'var(--bg-slate)' }}>
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title className="text-gradient">PayLogic</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0">
          <SidebarContent />
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}

export default Sidebar
