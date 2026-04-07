import { Button, Container } from 'react-bootstrap'
import { HiOutlineMenuAlt2, HiOutlineBell, HiOutlineUserCircle } from 'react-icons/hi'
import { useDispatch } from 'react-redux'
import { toggleSidebar } from '../../redux/uiSlice'

const TopBar = ({ title }) => {
  const dispatch = useDispatch()

  return (
    <div className="top-bar py-3 px-4 mb-4 d-flex align-items-center justify-content-between glass-card border-0 rounded-4 shadow-sm">
      <div className="d-flex align-items-center gap-3">
        <Button
          variant="link"
          className="p-0 text-white d-lg-none"
          onClick={() => dispatch(toggleSidebar())}
        >
          <HiOutlineMenuAlt2 size={24} />
        </Button>
        <h4 className="mb-0 fw-bold text-white">{title || 'Dashboard'}</h4>
      </div>

      <div className="d-flex align-items-center gap-4">
        {/* <div className="cursor-pointer position-relative p-2 rounded-3 hover-lift bg-white bg-opacity-5">
          <HiOutlineBell size={22} className="text-slate" />
          <span className="position-absolute top-0 start-100 translate-middle p-1 bg-emerald border border-light rounded-circle" style={{ backgroundColor: 'var(--primary-emerald)' }}></span>
        </div> */}

        <div className="d-flex align-items-center gap-3 cursor-pointer p-1 ps-3 rounded-pill bg-white bg-opacity-5 hover-lift border border-white border-opacity-5">
          <div className="text-end d-none d-sm-block">
            <p className="mb-0 small fw-bold">Admin User</p>
            {/* <p className="mb-0 smaller text-slate">HR Manager</p> */}
          </div>
          <div className="p-2 bg-emerald rounded-circle" style={{ backgroundColor: 'var(--primary-emerald)' }}>
            <HiOutlineUserCircle size={24} className="text-white" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopBar
