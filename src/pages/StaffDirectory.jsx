import { useEffect, useState } from 'react'
import { Row, Col, Card, Table, Button, Badge, InputGroup, Form } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'
import { HiOutlineUserAdd, HiOutlinePencilAlt, HiOutlineTrash, HiOutlineSearch, HiOutlineFilter, HiOutlineUser, HiOutlineDocumentReport } from 'react-icons/hi'
import { useSelector, useDispatch } from 'react-redux'
import { setEmployees, addEmployee, updateEmployeeInList, deleteEmployeeFromList } from '../redux/employeeSlice'
import { fetchEmployees, addEmployee as addEmployeeService, updateEmployee as updateEmployeeService, deleteEmployee as deleteEmployeeService } from '../services/employeeService'
import EmployeeModal from '../components/Admin/EmployeeModal'
import StaffPayrollModal from '../components/Admin/StaffPayrollModal'
import { setGlobalLoading, addAlert } from '../redux/uiSlice'
import { fetchEmployeePayrollHistory } from '../services/payrollService'

const StaffDirectory = () => {
    const dispatch = useDispatch()
    const location = useLocation()
    const employees = useSelector((state) => state.employees.list)
    const [showModal, setShowModal] = useState(false)
    const [showHistoryModal, setShowHistoryModal] = useState(false)
    const [selectedEmployee, setSelectedEmployee] = useState(null)
    const [employeeHistory, setEmployeeHistory] = useState([])
    const [modalLoading, setModalLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        loadEmployees()
        if (location.state?.filter) {
            setSearchTerm(location.state.filter)
        }
    }, [location.state])

    const loadEmployees = async () => {
        try {
            dispatch(setGlobalLoading({ loading: true, title: 'Syncing Data', message: 'Fetching latest employee records...' }))
            const data = await fetchEmployees()
            dispatch(setEmployees(data))
        } catch (error) {
            console.error("Failed to load employees:", error)
            dispatch(addAlert({ type: 'error', message: 'Failed to synchronize employee data. Please try again.' }))
        } finally {
            dispatch(setGlobalLoading(false))
        }
    }

    const handleSave = async (formData) => {
        try {
            dispatch(setGlobalLoading({
                loading: true,
                title: selectedEmployee ? 'Updating File' : 'Creating Employee',
                message: 'Writing records to secure payroll vault...'
            }))
            if (selectedEmployee) {
                const updated = await updateEmployeeService(selectedEmployee.id, formData)
                dispatch(updateEmployeeInList(updated))
                dispatch(addAlert({ type: 'success', message: 'Employee profile updated successfully.' }))
            } else {
                const created = await addEmployeeService(formData)
                dispatch(addEmployee(created))
                dispatch(addAlert({ type: 'success', message: 'New employee registered and added to payroll.' }))
            }
            setShowModal(false)
        } catch (error) {
            console.error("Save failed:", error)
            dispatch(addAlert({ type: 'error', message: 'Record save failed. Please check your network connection.' }))
        } finally {
            dispatch(setGlobalLoading(false))
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this employee record?")) {
            try {
                dispatch(setGlobalLoading({ loading: true, title: 'Archiving Record', message: 'Removing employee from active payroll...' }))
                await deleteEmployeeService(id)
                dispatch(deleteEmployeeFromList(id))
                dispatch(addAlert({ type: 'success', message: 'Employee record has been archived.' }))
            } catch (error) {
                console.error("Delete failed:", error)
                dispatch(addAlert({ type: 'error', message: 'Failed to delete record. User may have active sessions.' }))
            } finally {
                dispatch(setGlobalLoading(false))
            }
        }
    }

    const handleViewHistory = async (employee) => {
        try {
            dispatch(setGlobalLoading({ loading: true, title: 'Retrieving Ledger', message: `Fetching payroll history for ${employee.full_name}...` }))
            const data = await fetchEmployeePayrollHistory(employee.id)
            setEmployeeHistory(data)
            setSelectedEmployee(employee)
            setShowHistoryModal(true)
        } catch (error) {
            console.error("History fetch failed:", error)
            dispatch(addAlert({ type: 'error', message: 'Failed to retrieve employee payroll history.' }))
        } finally {
            dispatch(setGlobalLoading(false))
        }
    }

    const filteredEmployees = employees.filter(e =>
        e.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.department.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="staff-directory animate-slide-up">
            <Row className="mb-4 align-items-center">
                <Col md={6}>
                    <InputGroup className="glass-card border-0 mb-3 mb-md-0 shadow-sm overflow-hidden" style={{ maxWidth: '400px' }}>
                        <InputGroup.Text className="bg-transparent border-0 text-slate">
                            <HiOutlineSearch />
                        </InputGroup.Text>
                        <Form.Control
                            placeholder="Search employee or department..."
                            className="bg-transparent border-0 text-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                </Col>
                <Col md={6} className="text-md-end">
                    <Button
                        className="btn-emerald d-flex align-items-center gap-2 ms-auto"
                        onClick={() => {
                            setSelectedEmployee(null)
                            setShowModal(true)
                        }}
                    >
                        <HiOutlineUserAdd size={20} />
                        Register Employee
                    </Button>
                </Col>
            </Row>

            <Card className="glass-card border-0 shadow-lg overflow-hidden">
                <div className="table-scroll-container">
                    <Table hover className="mb-0 custom-table">
                        <thead>
                            <tr>
                                <th className="border-0 bg-transparent text-slate small fw-bold text-uppercase py-4 px-4">Employee</th>
                                <th className="border-0 bg-transparent text-slate small fw-bold text-uppercase py-4">Department</th>
                                <th className="border-0 bg-transparent text-slate small fw-bold text-uppercase py-4">Status</th>
                                <th className="border-0 bg-transparent text-slate small fw-bold text-uppercase py-4">Base Salary</th>
                                <th className="border-0 bg-transparent text-slate small fw-bold text-uppercase py-4 text-end px-4">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="border-0">
                            {filteredEmployees.map((e) => (
                                <tr key={e.id} className="align-middle border-white border-opacity-5">
                                    <td className="py-4 px-4 border-0">
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="avatar-circle p-2 rounded-circle bg-opacity-10 text-emerald">
                                                <HiOutlineUser size={20} />
                                            </div>
                                            <div>
                                                <div className="fw-bold text-black">{e.full_name}</div>
                                                <div className="small text-black">{e.email}</div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="py-4 border-0">
                                        <Badge
                                            bg="primary"
                                            className="bg-opacity-10 text-primary border border-primary border-opacity-25 px-3 py-2 fw-bold"
                                        >
                                            {e.department}
                                        </Badge>
                                    </td>

                                    <td className="py-4 border-0">
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="p-1 bg-success rounded-circle"></div>
                                            Active
                                        </div>
                                    </td>

                                    <td className="py-4 border-0">
                                        <span className="fw-bold">
                                            ₦{parseFloat(e.base_salary).toLocaleString()}
                                        </span>
                                    </td>

                                    <td className="py-4 text-end border-0 px-4">
                                        <div className="d-flex justify-content-end gap-2">
                                            <Button
                                                variant="link"
                                                className="p-2 text-slate hover-primary"
                                                onClick={() => handleViewHistory(e)}
                                            >
                                                <HiOutlineDocumentReport size={20} />
                                            </Button>

                                            <Button
                                                variant="link"
                                                className="p-2 text-slate hover-primary"
                                                onClick={() => {
                                                    setSelectedEmployee(e);
                                                    setShowModal(true);
                                                }}
                                            >
                                                <HiOutlinePencilAlt size={20} />
                                            </Button>

                                            <Button
                                                variant="link"
                                                className="p-2 text-slate hover-danger"
                                                onClick={() => handleDelete(e.id)}
                                            >
                                                <HiOutlineTrash size={20} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </Card>

            <EmployeeModal
                show={showModal}
                onHide={() => setShowModal(false)}
                employee={selectedEmployee}
                onSave={handleSave}
                loading={modalLoading}
            />

            <StaffPayrollModal
                show={showHistoryModal}
                onHide={() => setShowHistoryModal(false)}
                employee={selectedEmployee}
                history={employeeHistory}
            />

            <style>
                {`

                `}
            </style>
        </div>
    )
}

export default StaffDirectory
