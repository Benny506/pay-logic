import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Table, Spinner, Alert } from 'react-bootstrap';
import { motion, AnimatePresence } from 'motion/react';
import {
    HiOutlineMailOpen,
    HiOutlineCloudUpload,
    HiOutlineCheckCircle,
    HiOutlineExclamationCircle,
    HiOutlineDatabase,
    HiOutlineExternalLink,
    HiOutlineArrowRight
} from 'react-icons/hi';
import { supabase, supabaseAnonKey } from '../supabase/supabaseClient';
import { useDispatch } from 'react-redux';
import { setGlobalLoading } from '../redux/uiSlice';

const BulkEmailTool = () => {
    const dispatch = useDispatch();
    const [csvFile, setCsvFile] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processedData, setProcessedData] = useState([]);
    const [skippedCount, setSkippedCount] = useState(0);
    const [currentStep, setCurrentStep] = useState(1); // 1: Upload, 2: Preview, 3: Send
    const [isSending, setIsSending] = useState(false);
    const [resultMessage, setResultMessage] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
            setCsvFile(file);
        } else {
            alert('Please upload a valid CSV file.');
        }
    };

    const processCSV = async () => {
        if (!csvFile) return;
        setIsProcessing(true);
        dispatch(setGlobalLoading({ loading: true, title: 'Processing CSV', message: 'Extracting and validating staff emails...' }));

        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target.result;
            const rows = text.split(/\r?\n/);

            const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
            const foundEmails = new Set();

            rows.forEach(row => {
                const matches = row.match(emailRegex);
                if (matches) matches.forEach(email => foundEmails.add(email.toLowerCase().trim()));
            });

            if (foundEmails.size === 0) {
                alert('No emails found in the CSV.');
                setIsProcessing(false);
                dispatch(setGlobalLoading(false));
                return;
            }

            try {
                // 1. Validate Staff Only
                const { data: staff, error: staffError } = await supabase
                    .from('pay_employees')
                    .select('*')
                    .in('email', Array.from(foundEmails));

                if (staffError) throw staffError;

                // 2. Fetch Full History for each Staff
                const staffWithHistory = await Promise.all(staff.map(async (member) => {
                    const { data: history, error: historyError } = await supabase
                        .from('pay_transactions')
                        .select('*')
                        .eq('employee_id', member.id)
                        .order('year', { ascending: false })
                        .order('month', { ascending: false });

                    if (historyError) throw historyError;

                    return {
                        ...member,
                        history,
                        lifetimePaid: history.reduce((sum, t) => sum + parseFloat(t.net_pay || 0), 0),
                        avgNet: history.length > 0 ? history.reduce((sum, t) => sum + parseFloat(t.net_pay || 0), 0) / history.length : 0
                    };
                }));

                setProcessedData(staffWithHistory);
                setSkippedCount(foundEmails.size - staff.length);
                setCurrentStep(2);
            } catch (err) {
                console.error("Processing Error:", err);
                alert('An error occurred while processing staff data.');
            } finally {
                setIsProcessing(false);
                dispatch(setGlobalLoading(false));
            }
        };
        reader.readAsText(csvFile);
    };

    const generateEmailHTML = (member) => {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const historyRows = member.history.map(t => `
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #f1f5f9;">${monthNames[t.month - 1]} ${t.year}</td>
                <td style="padding: 12px; border-bottom: 1px solid #f1f5f9;">₦${parseFloat(t.gross_pay || 0).toLocaleString()}</td>
                <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; color: #ef4444;">-₦${parseFloat(t.tax_deduction || 0).toLocaleString()}</td>
                <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; font-weight: 700; color: #059669;">₦${parseFloat(t.net_pay || 0).toLocaleString()}</td>
            </tr>
        `).join('');

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Inter', sans-serif; color: #1e293b; line-height: 1.6; margin: 0; padding: 0; background-color: #f8fafc; }
                    .container { max-width: 700px; margin: 40px auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
                    .header { background: linear-gradient(135deg, #10b981 0%, #065f46 100%); padding: 50px 40px; color: white; }
                    .summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; padding: 30px 40px; background: #f1f5f9; }
                    .card { background: white; padding: 20px; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
                    .card-label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; margin-bottom: 4px; }
                    .card-value { font-size: 20px; font-weight: 800; color: #0f172a; }
                    .content { padding: 40px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th { text-align: left; font-size: 12px; text-transform: uppercase; color: #64748b; padding: 12px; border-bottom: 2px solid #e2e8f0; }
                    .footer { padding: 30px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1 style="margin: 0; font-size: 28px; font-weight: 800;">Statement of Earnings</h1>
                        <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">Prepared for <strong>${member.full_name}</strong></p>
                    </div>
                    <div class="summary-grid">
                        <div class="card"><div class="card-label">Lifetime Earnings</div><div class="card-value">₦${member.lifetimePaid.toLocaleString()}</div></div>
                        <div class="card"><div class="card-label">Avg. Monthly Net</div><div class="card-value">₦${Math.round(member.avgNet).toLocaleString()}</div></div>
                    </div>
                    <div class="content">
                        <h3 style="margin-top: 0; font-weight: 800;">Historical Breakdown</h3>
                        <table>
                            <thead><tr><th>Period</th><th>Gross</th><th>Deductions</th><th>Net Payout</th></tr></thead>
                            <tbody>${historyRows}</tbody>
                        </table>
                    </div>
                    <div class="footer">&copy; 2026 PayLogic Systems. Automated encrypted statement.</div>
                </div>
            </body>
            </html>
        `;
    };

    const startSending = async () => {
        setIsSending(true);
        setResultMessage(null);

        const emailPayloads = processedData.map(member => ({
            to: member.email,
            subject: `Payroll Statement - ${member.full_name}`,
            html: generateEmailHTML(member)
        }));

        try {
            const response = await fetch('https://tiwuhxljzjknkvplrxrg.supabase.co/functions/v1/bulk-payroll-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${supabaseAnonKey}`
                },
                body: JSON.stringify({ emails: emailPayloads })
            });

            const result = await response.json();
            if (response.ok) {
                setResultMessage({ type: 'success', text: result.message });
                setCurrentStep(3);
            } else {
                throw new Error(result.error || 'Failed to send emails');
            }
        } catch (err) {
            setResultMessage({ type: 'danger', text: err.message });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Container className="py-5 animate-slide-up">
            <Row className="justify-content-center">
                <Col lg={10}>
                    <div className="d-flex align-items-center gap-3 mb-5">
                        <div className="p-3 rounded-4 bg-emerald bg-opacity-10 text-emerald"><HiOutlineMailOpen size={32} /></div>
                        <div>
                            <h2 className="fw-extrabold text-black mb-0">Bulk Payroll Reporter</h2>
                            <p className="text-slate mb-0">Full history distribution system</p>
                        </div>
                    </div>

                    <div className="d-flex gap-2 mb-4">
                        {[1, 2, 3].map(step => (
                            <div key={step} className={`flex-grow-1 p-1 rounded-pill ${currentStep >= step ? 'bg-emerald' : 'bg-white bg-opacity-10'}`} />
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {currentStep === 1 && (
                            <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                                <Card className="glass-card border-white border-opacity-10 p-5 text-center">
                                    <HiOutlineCloudUpload size={64} className="text-emerald opacity-50 mb-3" />
                                    <h3 className="text-white fw-bold">Upload Recipient CSV</h3>
                                    <p className="text-slate">Extract emails and filter for staff only.</p>
                                    <Form.Control type="file" accept=".csv" onChange={handleFileChange} className="bg-white bg-opacity-5 border-white border-opacity-10 text-slate p-3 rounded-4 mb-4 mx-auto" style={{ maxWidth: '400px' }} />
                                    <Button variant="emerald" className="px-5 py-3 rounded-pill fw-bold" disabled={!csvFile || isProcessing} onClick={processCSV}>
                                        {isProcessing ? 'Analysing Data...' : 'Process & Validate Emails'}
                                    </Button>
                                </Card>
                            </motion.div>
                        )}

                        {currentStep === 2 && (
                            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <Row className="g-4 mb-4">
                                    <Col md={6}><Card className="glass-card p-4 border-emerald border-opacity-20 text-center"><h4 className="text-emerald fw-bold mb-0">{processedData.length}</h4><small className="text-slate uppercase smaller">Verified Staff</small></Card></Col>
                                    <Col md={6}><Card className="glass-card p-4 border-warning border-opacity-20 text-center"><h4 className="text-warning fw-bold mb-0">{skippedCount}</h4><small className="text-slate uppercase smaller">Ignored</small></Card></Col>
                                </Row>
                                <Card className="glass-card border-white border-opacity-10 p-4 mb-4">
                                    <h5 className="text-white fw-bold mb-4 d-flex align-items-center gap-2"><HiOutlineDatabase className="text-emerald" /> Data Preview</h5>
                                    <div className="table-responsive">
                                        <Table hover variant="dark" className="bg-transparent mb-0">
                                            <thead><tr className="border-bottom border-white border-opacity-10"><th className="text-slate smaller border-0">EMPLOYEE</th><th className="text-slate smaller border-0">LIFETIME PAYOUT</th><th className="text-slate smaller border-0">ACTIONS</th></tr></thead>
                                            <tbody>
                                                {processedData.map((staff, idx) => (
                                                    <tr key={idx} className="border-bottom border-white border-opacity-5">
                                                        <td className="py-3 border-0"><div className="fw-bold text-white">{staff.full_name}</div><small className="text-slate">{staff.email}</small></td>
                                                        <td className="py-3 border-0 text-emerald fw-bold">₦{staff.lifetimePaid.toLocaleString()}</td>
                                                        <td className="py-3 border-0">
                                                            <Button variant="link" size="sm" className="text-emerald p-0 text-decoration-none d-flex align-items-center gap-1" onClick={() => { const win = window.open("", "_blank"); win.document.write(generateEmailHTML(staff)); }}>
                                                                Preview <HiOutlineExternalLink />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                </Card>
                                <div className="d-flex justify-content-between align-items-center">
                                    <Button variant="link" className="text-slate text-decoration-none" onClick={() => setCurrentStep(1)}>Back</Button>
                                    <Button variant="emerald" className="px-5 py-3 rounded-pill fw-bold d-flex align-items-center gap-2" disabled={isSending} onClick={startSending}>
                                        {isSending ? <Spinner animation="border" size="sm" /> : <>Confirm & Dispatch <HiOutlineArrowRight /></>}
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 3 && (
                            <motion.div key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                                <Card className="glass-card border-white border-opacity-10 p-5">
                                    <HiOutlineCheckCircle size={80} className="text-emerald mb-3" />
                                    <h2 className="text-white fw-extrabold">Dispatch Successful!</h2>
                                    <p className="text-slate lead">{resultMessage?.text}</p>
                                    <Button variant="emerald" className="px-5 py-3 rounded-pill fw-bold mt-4" onClick={() => { setCurrentStep(1); setProcessedData([]); setCsvFile(null); }}>Start New Batch</Button>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {resultMessage?.type === 'danger' && <Alert variant="danger" className="mt-4 rounded-4 bg-danger bg-opacity-10 border-danger border-opacity-20 text-danger">{resultMessage.text}</Alert>}
                </Col>
            </Row>

            <style>{`
                .fw-extrabold { font-weight: 800; }
                .glass-card { background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(12px); border-radius: 32px; }
                .text-emerald { color: #10B981; }
                .bg-emerald { background-color: #10B981 !important; }
                .btn-emerald { background: #10B981; color: white; border: none; transition: all 0.3s ease; }
                .btn-emerald:hover { background: #059669; transform: translateY(-2px); box-shadow: 0 10px 20px -5px rgba(16, 185, 129, 0.4); }
            `}</style>
        </Container>
    );
};

export default BulkEmailTool;
