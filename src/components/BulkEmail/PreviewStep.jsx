import React from 'react';
import { Row, Col, Card, Table, Button, Spinner } from 'react-bootstrap';
import { motion } from 'motion/react';
import { HiOutlineDatabase, HiOutlineExternalLink, HiOutlineArrowRight } from 'react-icons/hi';
import { generatePdfHTML } from './EmailTemplate';
import { downloadLocalPDF } from './PdfService';

const PreviewStep = ({ processedData, skippedCount, onBack, onConfirm, isSending }) => {
    return (
        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Row className="g-4 mb-4">
                <Col md={6}>
                    <Card className="glass-card p-4 border-emerald border-opacity-20 text-center">
                        <h4 className="text-emerald fw-bold mb-0">{processedData.length}</h4>
                        <small className="text-slate uppercase smaller">Verified Staff</small>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="glass-card p-4 border-warning border-opacity-20 text-center">
                        <h4 className="text-warning fw-bold mb-0">{skippedCount}</h4>
                        <small className="text-slate uppercase smaller">Ignored</small>
                    </Card>
                </Col>
            </Row>
            <Card className="glass-card border-white border-opacity-10 p-4 mb-4">
                <h5 className="text-white fw-bold mb-4 d-flex align-items-center gap-2"><HiOutlineDatabase className="text-emerald" /> Data Preview</h5>
                <div className="table-responsive">
                    <Table hover variant="dark" className="bg-transparent mb-0">
                        <thead>
                            <tr className="border-bottom border-white border-opacity-10">
                                <th className="text-slate smaller border-0">EMPLOYEE</th>
                                <th className="text-slate smaller border-0">NET PAYOUT</th>
                                <th className="text-slate smaller border-0">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {processedData.map((staff, idx) => (
                                <tr key={idx} className="border-bottom border-white border-opacity-5">
                                    <td className="py-3 border-0">
                                        <div className="fw-bold text-white">{staff['Name:']}</div>
                                        <small className="text-slate">{staff.Email}</small>
                                    </td>
                                    <td className="py-3 border-0 text-emerald fw-bold">
                                        ₦{parseFloat((staff['NET PAY'] || '0').replace(/,/g, '')).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="py-3 border-0">
                                        <div className="d-flex gap-3">
                                            <Button variant="link" size="sm" className="text-emerald p-0 text-decoration-none d-flex align-items-center gap-1" onClick={() => { const win = window.open("", "_blank"); win.document.write(generatePdfHTML(staff)); }}>
                                                Preview Slip <HiOutlineExternalLink />
                                            </Button>
                                            <Button variant="link" size="sm" className="text-primary p-0 text-decoration-none d-flex align-items-center gap-1" onClick={() => downloadLocalPDF(staff)}>
                                                Download PDF
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </Card>
            <div className="d-flex justify-content-between align-items-center">
                <Button variant="link" className="text-slate text-decoration-none" onClick={onBack}>Back</Button>
                <Button variant="emerald" className="px-5 py-3 rounded-pill fw-bold d-flex align-items-center gap-2" disabled={isSending} onClick={onConfirm}>
                    {isSending ? <Spinner animation="border" size="sm" /> : <>Confirm & Dispatch <HiOutlineArrowRight /></>}
                </Button>
            </div>
        </motion.div>
    );
};

export default PreviewStep;
