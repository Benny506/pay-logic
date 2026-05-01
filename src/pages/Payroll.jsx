import { useEffect, useState, useMemo } from 'react'
import { Row, Col, Card, Table, Button, Modal, Form, Badge } from 'react-bootstrap'
import {
    HiOutlineCurrencyDollar,
    HiOutlineCalculator,
    HiOutlineBadgeCheck,
    HiOutlineArrowCircleRight,
    HiOutlinePrinter,
    HiOutlineDocumentReport,
} from 'react-icons/hi'
import { useSelector, useDispatch } from 'react-redux'
import { setGlobalLoading, addAlert } from '../redux/uiSlice'
import { setHistory, addPayrollRun } from '../redux/payrollSlice'
import { fetchPayrollHistory, createPayrollRun, calculateDeductions, fetchRunTransactions } from '../services/payrollService'
import { fetchEmployees } from '../services/employeeService'
import { motion, AnimatePresence } from 'motion/react'
import { GoHistory } from "react-icons/go";

const Payroll = () => {
    const dispatch = useDispatch()
    const history = useSelector((state) => state.payroll.history)
    const [showRunModal, setShowRunModal] = useState(false)
    const [showReportModal, setShowReportModal] = useState(false)
    const [selectedRun, setSelectedRun] = useState(null)
    const [reportTransactions, setReportTransactions] = useState([])
    const [employees, setEmployees] = useState([])
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

    useEffect(() => {
        loadPayrollHistory()
        loadEmployees()
    }, [])

    const loadPayrollHistory = async () => {
        try {
            const data = await fetchPayrollHistory()
            dispatch(setHistory(data))
        } catch (error) {
            console.error("History fetch failed:", error)
        }
    }

    const loadEmployees = async () => {
        try {
            const data = await fetchEmployees()
            setEmployees(data)
        } catch (error) {
            console.error("Employee fetch failed:", error)
        }
    }

    const loadReport = async (run) => {
        try {
            dispatch(setGlobalLoading({ loading: true, title: 'Fetching Report', message: 'Retrieving secure transaction ledger...' }))
            const data = await fetchRunTransactions(run.id)
            setReportTransactions(data)
            setSelectedRun(run)
            setShowReportModal(true)
        } catch (error) {
            console.error("Report fetch failed:", error)
            dispatch(addAlert({ type: 'error', message: 'Failed to retrieve detailed report.' }))
        } finally {
            dispatch(setGlobalLoading(false))
        }
    }

    const previewData = useMemo(() => {
        return employees.map(emp => ({
            ...emp,
            ...calculateDeductions(emp.base_salary)
        }))
    }, [employees])

    const totalPayoutPreview = useMemo(() => {
        return previewData.reduce((sum, item) => sum + item.net_pay, 0)
    }, [previewData])

    const handleInitiatePayroll = async () => {
        if (!employees.length) return

        try {
            dispatch(setGlobalLoading({
                loading: true,
                title: 'Executing Payroll',
                message: `Processing payouts for ${new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long' })} ${selectedYear}...`
            }))

            const newRun = await createPayrollRun(selectedMonth, selectedYear, employees)
            dispatch(addPayrollRun(newRun))
            dispatch(addAlert({ type: 'success', message: `Payroll Run for ${selectedMonth}/${selectedYear} completed successfully.` }))
            setShowRunModal(false)
        } catch (error) {
            console.error("Payroll Execution Error:", error)
            dispatch(addAlert({ type: 'error', message: "Failed to finalize payroll run. Check database constraints." }))
        } finally {
            dispatch(setGlobalLoading(false))
        }
    }

    const MonthName = (m) => new Date(0, m - 1).toLocaleString('default', { month: 'long' })

    return (
        <div className="payroll-page animate-slide-up">
            {/* Calculation Reference Header */}
            <Row className="mb-4">
                <Col md={12}>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-4 border border-emerald border-opacity-20 d-flex align-items-center justify-content-between flex-wrap gap-4"
                        style={{ borderRadius: '24px' }}
                    >
                        <div className="d-flex align-items-center gap-3">
                            <div className="p-3 bg-emerald bg-opacity-10 rounded-circle text-emerald">
                                <HiOutlineCalculator size={28} />
                            </div>
                            <div>
                                <h4 className="fw-bold text-white mb-1">Standard Deduction Logic</h4>
                                <p className="text-slate mb-0 small uppercase tracking-wider">Automated 10/5/5 Model (Presentation Reference)</p>
                            </div>
                        </div>

                        <div className="d-flex gap-4">
                            <div className="text-center px-4 border-end border-white border-opacity-10">
                                <h3 className="text-emerald fw-extrabold mb-0">10%</h3>
                                <small className="text-slate fw-bold smaller text-uppercase">Tax (PAYE)</small>
                            </div>
                            <div className="text-center px-4 border-end border-white border-opacity-10">
                                <h3 className="text-emerald fw-extrabold mb-0">5%</h3>
                                <small className="text-slate fw-bold smaller text-uppercase">NHIS (Ins.)</small>
                            </div>
                            <div className="text-center px-4">
                                <h3 className="text-emerald fw-extrabold mb-0">5%</h3>
                                <small className="text-slate fw-bold smaller text-uppercase">Pension</small>
                            </div>
                        </div>
                    </motion.div>
                </Col>
            </Row>

            {/* Main Content Sections */}
            <Row className="g-4">
                {/* Payroll History Table */}
                <Col lg={12}>
                    <Card className="glass-card border-0 shadow-lg" style={{ borderRadius: '24px', overflow: 'hidden' }}>
                        <div className="p-4 border-bottom border-white border-opacity-5 d-flex justify-content-between align-items-center bg-white bg-opacity-5">
                            <div className="d-flex align-items-center gap-2">
                                <GoHistory className="text-emerald" size={24} />
                                <h5 className="mb-0 fw-bold text-black">Payroll Execution History</h5>
                            </div>
                            <Button
                                className="btn-emerald d-flex align-items-center gap-2 px-4"
                                onClick={() => setShowRunModal(true)}
                            >
                                <HiOutlineArrowCircleRight size={20} />
                                New Payroll Run
                            </Button>
                        </div>

                        <Table responsive hover className="mb-0 custom-table">
                            <thead>
                                <tr className="border-0">
                                    <th className="bg-transparent border-0 py-4 px-4 text-slate small fw-bold text-uppercase">Period</th>
                                    <th className="bg-transparent border-0 py-4 text-slate small fw-bold text-uppercase">Total Payout</th>
                                    <th className="bg-transparent border-0 py-4 text-slate small fw-bold text-uppercase text-center">Status</th>
                                    <th className="bg-transparent border-0 py-4 text-slate small fw-bold text-uppercase text-end px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map(run => (
                                    <tr key={run.id} className="align-middle border-black border-opacity-5">
                                        <td className="py-4 px-4 border-0">
                                            <div className="d-flex align-items-center gap-2 text-black fw-bold">
                                                {MonthName(run.month)} {run.year}
                                            </div>
                                        </td>
                                        <td className="py-4 border-0">
                                            <span className="fw-extrabold text-emerald">${parseFloat(run.total_payout).toLocaleString()}</span>
                                        </td>
                                        <td className="py-4 border-0 text-center">
                                            <Badge bg="success" className="bg-opacity-10 text-success rounded-pill px-3 py-2 fw-medium border-success border-opacity-10">
                                                {run.status}
                                            </Badge>
                                        </td>
                                        <td className="py-4 text-end px-4 border-0">
                                            <Button
                                                variant="link"
                                                className="text-slate hover-primary p-0"
                                                onClick={() => loadReport(run)}
                                            >
                                                <HiOutlineDocumentReport size={20} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {history.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="text-center py-5 text-slate opacity-50 italic">
                                            No payroll history found. Initiate your first run to see records.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Card>
                </Col>
            </Row>

            {/* Initiation Modal with PREVIEW TABlE */}
            <Modal
                show={showRunModal}
                onHide={() => setShowRunModal(false)}
                size="xl"
                centered
                contentClassName="glass-card border-white border-opacity-10 shadow-2xl"
            >
                <Modal.Header closeButton closeVariant="white" className="border-bottom border-white border-opacity-10 p-4">
                    <Modal.Title className="fw-bold text-black d-flex align-items-center gap-2">
                        <HiOutlineBadgeCheck className="text-emerald" />
                        Monthly Payroll Review
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-4">
                        <div className="d-flex gap-3">
                            <Form.Group>
                                <Form.Label className="smaller text-slate fw-bold text-uppercase">Payout Month</Form.Label>
                                <Form.Select
                                    className="bg-midnight text-white border-emerald border-opacity-20 rounded-3"
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                >
                                    {[...Array(12)].map((_, i) => (
                                        <option key={i + 1} value={i + 1}>{MonthName(i + 1)}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className="smaller text-slate fw-bold text-uppercase">Payout Year</Form.Label>
                                <Form.Select
                                    className="bg-midnight text-white border-emerald border-opacity-20 rounded-3"
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                >
                                    {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                                </Form.Select>
                            </Form.Group>
                        </div>
                        <div className="text-end">
                            <p className="text-slate text-uppercase small fw-bold mb-0">Projected Total Payout</p>
                            <h2 className="text-emerald fw-extrabold mb-0">${totalPayoutPreview.toLocaleString()}</h2>
                        </div>
                    </div>

                    <div className="table-responsive" style={{ maxHeight: '400px' }}>
                        <Table hover variant="dark" className="bg-transparent border-white border-opacity-10">
                            <thead className="sticky-top bg-midnight mb-2">
                                <tr className="border-white border-opacity-10">
                                    <th className="py-3 px-3 text-slate smaller text-uppercase fw-bold">Employee</th>
                                    <th className="py-3 text-slate smaller text-uppercase fw-bold">Gross ($)</th>
                                    <th className="py-3 text-danger smaller text-uppercase fw-bold">Tax (10%)</th>
                                    <th className="py-3 text-danger smaller text-uppercase fw-bold text-nowrap">Ins. (5%)</th>
                                    <th className="py-3 text-danger smaller text-uppercase fw-bold text-nowrap">Pens. (5%)</th>
                                    <th className="py-3 text-emerald smaller text-uppercase fw-bold">Net Pay ($)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {previewData.map(item => (
                                    <tr key={item.id} className="align-middle border-white border-opacity-5">
                                        <td className="py-3 px-3 smaller fw-bold">{item.full_name}</td>
                                        <td className="py-3 smaller opacity-75">{parseFloat(item.base_salary).toLocaleString()}</td>
                                        <td className="py-3 smaller text-danger">-{item.tax_deduction.toLocaleString()}</td>
                                        <td className="py-3 smaller text-danger">-{item.insurance_deduction.toLocaleString()}</td>
                                        <td className="py-3 smaller text-danger">-{item.pension_deduction.toLocaleString()}</td>
                                        <td className="py-3 fw-extrabold text-emerald">${item.net_pay.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Modal.Body>
                <Modal.Footer className="border-top border-white border-opacity-10 p-4">
                    <Button variant="outline-light" className="rounded-pill px-4" onClick={() => setShowRunModal(false)}>
                        Cancel Run
                    </Button>
                    <Button className="btn-emerald rounded-pill px-5" onClick={handleInitiatePayroll}>
                        Finalize & Process Payouts
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Detailed Report Modal */}
            <Modal
                show={showReportModal}
                onHide={() => setShowReportModal(false)}
                size="xl"
                centered
                contentClassName="glass-card border-white border-opacity-10 shadow-2xl overflow-hidden printable-area"
            >
                <Modal.Header closeButton closeVariant="black" className="border-bottom border-white border-opacity-10 p-4">
                    <div className="d-flex align-items-center gap-3">
                        <div className="p-2 bg-emerald bg-opacity-10 rounded-circle text-emerald">
                            <HiOutlineDocumentReport size={24} />
                        </div>
                        <div>
                            <Modal.Title className="fw-bold text-black h5 mb-0">
                                Payroll Audit: {selectedRun && MonthName(selectedRun.month)} {selectedRun && selectedRun.year}
                            </Modal.Title>
                            <small className="text-slate uppercase smaller">Transaction ID: {selectedRun?.id}</small>
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Body className="p-4 bg-midnight bg-opacity-30">
                    <div className="d-flex justify-content-between align-items-center mb-4 text-white">
                        <div className="p-3 rounded-4 bg-white bg-opacity-5 border border-white border-opacity-5">
                            <p className="smaller text-slate fw-bold text-uppercase mb-1">Batch Total Payout</p>
                            <h3 className="fw-extrabold text-emerald mb-0">${parseFloat(selectedRun?.total_payout || 0).toLocaleString()}</h3>
                        </div>
                        <Button className="btn-emerald d-flex align-items-center gap-2 px-4 rounded-pill no-print" onClick={() => window.print()}>
                            <HiOutlinePrinter size={20} />
                            Print Summary
                        </Button>
                    </div>

                    <div className="table-responsive" style={{ maxHeight: '500px' }}>
                        <Table hover variant="dark" className="bg-transparent mb-0">
                            <thead className="sticky-top bg-midnight">
                                <tr className="border-white border-opacity-10">
                                    <th className="py-3 px-3 text-slate smaller text-uppercase fw-bold">Employee Name</th>
                                    <th className="py-3 text-slate smaller text-uppercase fw-bold text-end">Gross ($)</th>
                                    <th className="py-3 text-danger smaller text-uppercase fw-bold text-end">Tax (-10%)</th>
                                    <th className="py-3 text-danger smaller text-uppercase fw-bold text-end">Ins. (-5%)</th>
                                    <th className="py-3 text-danger smaller text-uppercase fw-bold text-end">Pens. (-5%)</th>
                                    <th className="py-3 text-emerald smaller text-uppercase fw-bold text-end pe-4">Net Payout ($)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportTransactions.map(trans => (
                                    <tr key={trans.id} className="align-middle border-white border-opacity-5">
                                        <td className="py-3 px-3 smaller fw-bold">{trans.pay_employees?.full_name}</td>
                                        <td className="py-3 smaller opacity-75 text-end">{parseFloat(trans.gross_pay).toLocaleString()}</td>
                                        <td className="py-3 smaller text-danger text-end">-{parseFloat(trans.tax_deduction).toLocaleString()}</td>
                                        <td className="py-3 smaller text-danger text-end">-{parseFloat(trans.insurance_deduction).toLocaleString()}</td>
                                        <td className="py-3 smaller text-danger text-end">-{parseFloat(trans.pension_deduction).toLocaleString()}</td>
                                        <td className="py-3 fw-extrabold text-emerald text-end pe-4">${parseFloat(trans.net_pay).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Modal.Body>
                <Modal.Footer className="border-top border-white border-opacity-10 p-4">
                    <Button variant="outline-dark" className="rounded-pill px-4 no-print" onClick={() => setShowReportModal(false)}>
                        Close Audit
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Payroll
