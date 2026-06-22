import React, { useState } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { AnimatePresence } from 'motion/react';
import { HiOutlineMailOpen } from 'react-icons/hi';
import { useDispatch } from 'react-redux';
import { setGlobalLoading } from '../redux/uiSlice';
import { supabaseAnonKey } from '../supabase/supabaseClient';
import UploadStep from '../components/BulkEmail/UploadStep';
import PreviewStep from '../components/BulkEmail/PreviewStep';
import SuccessStep from '../components/BulkEmail/SuccessStep';
import { generateEmailHTML } from '../components/BulkEmail/EmailTemplate';
import { generatePDFBase64 } from '../components/BulkEmail/PdfService';

const BulkEmailTool = () => {
    const dispatch = useDispatch();
    const [currentStep, setCurrentStep] = useState(1);
    const [processedData, setProcessedData] = useState([]);
    const [skippedCount, setSkippedCount] = useState(0);
    const [isSending, setIsSending] = useState(false);
    const [resultMessage, setResultMessage] = useState(null);

    const handleProcessComplete = (data, skipped) => {
        setProcessedData(data);
        setSkippedCount(skipped);
        setCurrentStep(2);
    };

    const handleError = (msg) => {
        setResultMessage(msg ? { type: 'danger', text: msg } : null);
    };

    const startSending = async () => {
        setIsSending(true);
        setResultMessage(null);
        dispatch(setGlobalLoading({ loading: true, title: 'Dispatching Emails', message: 'Generating PDFs and sending...' }));

        try {
            const emailPayloads = [];
            for (let i = 0; i < processedData.length; i++) {
                const member = processedData[i];
                const html = generateEmailHTML(member);
                const base64Pdf = await generatePDFBase64(html);
                
                emailPayloads.push({
                    to: member.Email,
                    subject: `${member.Period || 'Payroll'} Statement - ${member.Name}`,
                    html: html,
                    attachments: [
                        {
                            content: base64Pdf,
                            filename: `${(member.Name || 'Staff').replace(/\\s+/g, '_')}_Payslip.pdf`,
                            disposition: 'attachment'
                        }
                    ]
                });
            }

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
            dispatch(setGlobalLoading(false));
        }
    };

    const restart = () => {
        setCurrentStep(1);
        setProcessedData([]);
        setResultMessage(null);
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
                            <UploadStep 
                                onProcessComplete={handleProcessComplete} 
                                onError={handleError} 
                            />
                        )}

                        {currentStep === 2 && (
                            <PreviewStep 
                                processedData={processedData}
                                skippedCount={skippedCount}
                                isSending={isSending}
                                onBack={() => setCurrentStep(1)}
                                onConfirm={startSending}
                            />
                        )}

                        {currentStep === 3 && (
                            <SuccessStep 
                                resultMessage={resultMessage?.text}
                                onRestart={restart}
                            />
                        )}
                    </AnimatePresence>

                    {resultMessage?.type === 'danger' && (
                        <Alert variant="danger" className="mt-4 rounded-4 bg-danger bg-opacity-10 border-danger border-opacity-20 text-danger">
                            {resultMessage.text}
                        </Alert>
                    )}
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
