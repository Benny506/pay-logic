import React, { useState } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { motion } from 'motion/react';
import { HiOutlineCloudUpload } from 'react-icons/hi';
import Papa from 'papaparse';
import { useDispatch } from 'react-redux';
import { setGlobalLoading } from '../../redux/uiSlice';

const UploadStep = ({ onProcessComplete, onError }) => {
    const dispatch = useDispatch();
    const [csvFile, setCsvFile] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
            setCsvFile(file);
        } else {
            alert('Please upload a valid CSV file.');
        }
    };

    const processCSV = () => {
        if (!csvFile) return;
        setIsProcessing(true);
        dispatch(setGlobalLoading({ loading: true, title: 'Processing CSV', message: 'Extracting payslip records...' }));
        onError(null);

        Papa.parse(csvFile, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const { data } = results;
                
                // Filter out rows that are completely empty or lack an email
                const parsedStaff = data.filter(row => {
                    // Check if at least Name and Email are present
                    return row['Name:'] && row['Name:'].trim() !== '' && row['Email'] && row['Email'].includes('@');
                });

                if (parsedStaff.length === 0) {
                    onError('No valid staff payslips found with valid Emails. Make sure you are using the new template structure.');
                } else {
                    onProcessComplete(parsedStaff, data.length - parsedStaff.length);
                }
                setIsProcessing(false);
                dispatch(setGlobalLoading(false));
            },
            error: (err) => {
                onError(`Failed to parse CSV: ${err.message}`);
                setIsProcessing(false);
                dispatch(setGlobalLoading(false));
            }
        });
    };

    return (
        <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card className="glass-card border-white border-opacity-10 p-5 text-center">
                <HiOutlineCloudUpload size={64} className="text-emerald opacity-50 mb-3" />
                <h3 className="text-white fw-bold">Upload Recipient CSV</h3>
                <p className="text-slate mb-4">Upload the filled payslip template CSV to process bulk emails.</p>
                <div className="mb-4">
                    <Button variant="outline-light" href="/PAY_SLIP_Template.csv" download className="rounded-pill px-4">Download CSV Template</Button>
                </div>
                <Form.Control type="file" accept=".csv" onChange={handleFileChange} className="bg-white bg-opacity-5 border-white border-opacity-10 text-slate p-3 rounded-4 mb-4 mx-auto" style={{ maxWidth: '400px' }} />
                <Button variant="emerald" className="px-5 py-3 rounded-pill fw-bold" disabled={!csvFile || isProcessing} onClick={processCSV}>
                    {isProcessing ? 'Analysing Data...' : 'Process & Validate Emails'}
                </Button>
            </Card>
        </motion.div>
    );
};

export default UploadStep;
