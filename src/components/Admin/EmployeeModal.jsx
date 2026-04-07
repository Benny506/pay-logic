import { useState, useEffect } from 'react'
import { Modal, Button, Form, Row, Col, InputGroup } from 'react-bootstrap'
import { HiOutlineUser, HiOutlineMail, HiOutlineBadgeCheck, HiOutlineCurrencyDollar, HiOutlineOfficeBuilding } from 'react-icons/hi'
import { motion, AnimatePresence } from 'motion/react'

const EmployeeModal = ({ show, onHide, employee, onSave, loading }) => {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        department: '',
        job_title: '',
        base_salary: '',
        bank_name: '',
        account_number: ''
    })

    useEffect(() => {
        if (employee) {
            setFormData(employee)
        } else {
            setFormData({
                full_name: '',
                email: '',
                department: '',
                job_title: '',
                base_salary: '',
                bank_name: '',
                account_number: ''
            })
        }
    }, [employee, show])

    const handleSubmit = (e) => {
        e.preventDefault()
        onSave(formData)
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            size="lg"
            contentClassName="glass-card border-0 text-black"
            backdrop="static"
        >
            <Modal.Header closeButton closeVariant="black" className="border-bottom border-white border-opacity-20 p-4">
                <Modal.Title className="fw-bold">
                    {employee ? 'Edit Employee Profile' : 'Register New Employee'}
                </Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body className="p-4">
                    <Row className="g-4">
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="text-slate small fw-bold text-uppercase">Full Name</Form.Label>
                                <InputGroup className="border border-white border-opacity-25 rounded-3 overflow-hidden shadow-sm">
                                    <InputGroup.Text className="bg-white bg-opacity-10 border-0 text-emerald">
                                        <HiOutlineUser />
                                    </InputGroup.Text>
                                    <Form.Control
                                        placeholder="Enter full name"
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                        required
                                        className="border-0"
                                    />
                                </InputGroup>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="text-slate small fw-bold text-uppercase">Email Address</Form.Label>
                                <InputGroup className="border border-white border-opacity-25 rounded-3 overflow-hidden shadow-sm">
                                    <InputGroup.Text className="bg-white bg-opacity-10 border-0 text-emerald">
                                        <HiOutlineMail />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="email"
                                        placeholder="email@company.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        className="border-0"
                                    />
                                </InputGroup>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="text-slate small fw-bold text-uppercase">Department</Form.Label>
                                <InputGroup className="border border-white border-opacity-25 rounded-3 overflow-hidden shadow-sm">
                                    <InputGroup.Text className="bg-white bg-opacity-10 border-0 text-emerald">
                                        <HiOutlineOfficeBuilding />
                                    </InputGroup.Text>
                                    <Form.Select
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        required
                                        className="border-0"
                                    >
                                        <option value="">Select Department</option>
                                        <option value="Engineering">Engineering</option>
                                        <option value="HR">HR</option>
                                        <option value="Finance">Finance</option>
                                        <option value="Marketing">Marketing</option>
                                        <option value="Operations">Operations</option>
                                    </Form.Select>
                                </InputGroup>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="text-slate small fw-bold text-uppercase">Job Title</Form.Label>
                                <InputGroup className="border border-white border-opacity-25 rounded-3 overflow-hidden shadow-sm">
                                    <InputGroup.Text className="bg-white bg-opacity-10 border-0 text-emerald">
                                        <HiOutlineBadgeCheck />
                                    </InputGroup.Text>
                                    <Form.Control
                                        placeholder="Senior Engineer"
                                        value={formData.job_title}
                                        onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                                        required
                                        className="border-0"
                                    />
                                </InputGroup>
                            </Form.Group>
                        </Col>

                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label className="text-slate small fw-bold text-uppercase">Base Monthly Salary</Form.Label>
                                <InputGroup className="border border-white border-opacity-25 rounded-3 overflow-hidden shadow-sm">
                                    <InputGroup.Text className="bg-white bg-opacity-10 border-0 text-emerald">
                                        <HiOutlineCurrencyDollar />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="number"
                                        placeholder="0.00"
                                        value={formData.base_salary}
                                        onChange={(e) => setFormData({ ...formData, base_salary: e.target.value })}
                                        required
                                        className="border-0"
                                    />
                                </InputGroup>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="text-slate small fw-bold text-uppercase">Bank Name</Form.Label>
                                <Form.Control
                                    placeholder="Enter bank name"
                                    value={formData.bank_name}
                                    onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                                    className="bg-white bg-opacity-10 border-white border-opacity-25 rounded-3 text-black shadow-sm"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="text-slate small fw-bold text-uppercase">Account Number</Form.Label>
                                <Form.Control
                                    placeholder="0000000000"
                                    value={formData.account_number}
                                    onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                                    className="bg-white bg-opacity-10 border-white border-opacity-25 rounded-3 text-black shadow-sm"
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer className="border-top border-white border-opacity-20 p-4">
                    <Button variant="outline-light" onClick={onHide} className="rounded-pill px-4" disabled={loading}>
                        Cancel
                    </Button>
                    <Button type="submit" className="btn-emerald rounded-pill px-5" disabled={loading}>
                        {loading ? 'Processing...' : (employee ? 'Update Records' : 'Register Employee')}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

export default EmployeeModal
