import { Modal, Table, Button } from 'react-bootstrap'
import { HiOutlineDocumentReport, HiOutlinePrinter } from 'react-icons/hi'

const StaffPayrollModal = ({ show, onHide, employee, history }) => {
    const MonthName = (m) => new Date(0, m - 1).toLocaleString('default', { month: 'long' })

    return (
        <Modal
            show={show}
            onHide={onHide}
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
                            Payment History: {employee?.full_name}
                        </Modal.Title>
                        <small className="text-slate uppercase smaller">Employee ID: {employee?.id}</small>
                    </div>
                </div>
            </Modal.Header>
            <Modal.Body className="p-4 bg-midnight bg-opacity-30">
                <div className="d-flex justify-content-between align-items-center mb-4 text-white no-print">
                    <div className="p-3 rounded-4 bg-white bg-opacity-5 border border-white border-opacity-5">
                        <p className="smaller text-slate fw-bold text-uppercase mb-1">Total Career Payout</p>
                        <h3 className="fw-extrabold text-emerald mb-0">
                            ${history.reduce((sum, h) => sum + parseFloat(h.net_pay), 0).toLocaleString()}
                        </h3>
                    </div>
                    <Button className="btn-emerald d-flex align-items-center gap-2 px-4 rounded-pill" onClick={() => window.print()}>
                        <HiOutlinePrinter size={20} />
                        Print Report
                    </Button>
                </div>

                <div className="table-responsive" style={{ maxHeight: '500px' }}>
                    <Table hover variant="dark" className="bg-transparent mb-0">
                        <thead className="sticky-top bg-midnight">
                            <tr className="border-white border-opacity-10">
                                <th className="py-3 px-3 text-slate smaller text-uppercase fw-bold">Period</th>
                                <th className="py-3 text-slate smaller text-uppercase fw-bold text-end">Gross ($)</th>
                                <th className="py-3 text-danger smaller text-uppercase fw-bold text-end">Tax (-10%)</th>
                                <th className="py-3 text-danger smaller text-uppercase fw-bold text-end">Ins. (-5%)</th>
                                <th className="py-3 text-danger smaller text-uppercase fw-bold text-end">Pens. (-5%)</th>
                                <th className="py-3 text-emerald smaller text-uppercase fw-bold text-end pe-4">Net Payout ($)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map(trans => (
                                <tr key={trans.id} className="align-middle border-white border-opacity-5">
                                    <td className="py-3 px-3 smaller fw-bold">
                                        {MonthName(trans.month)} {trans.year}
                                    </td>
                                    <td className="py-3 smaller opacity-75 text-end">{parseFloat(trans.gross_pay).toLocaleString()}</td>
                                    <td className="py-3 smaller text-danger text-end">-{parseFloat(trans.tax_deduction).toLocaleString()}</td>
                                    <td className="py-3 smaller text-danger text-end">-{parseFloat(trans.insurance_deduction).toLocaleString()}</td>
                                    <td className="py-3 smaller text-danger text-end">-{parseFloat(trans.pension_deduction).toLocaleString()}</td>
                                    <td className="py-3 fw-extrabold text-emerald text-end pe-4">${parseFloat(trans.net_pay).toLocaleString()}</td>
                                </tr>
                            ))}
                            {history.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center py-5 text-slate opacity-50">
                                        No payment records found for this employee.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </Modal.Body>
            <Modal.Footer className="border-top border-white border-opacity-10 p-4 no-print">
                <Button variant="outline-dark" className="rounded-pill px-4" onClick={onHide}>
                    Close Record
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default StaffPayrollModal
