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
        dispatch(setGlobalLoading({ loading: true, title: 'Processing CSV', message: 'Extracting payslip chunks...' }));
        onError(null);

        Papa.parse(csvFile, {
            header: false,
            skipEmptyLines: false,
            complete: (results) => {
                const { data } = results;
                let currentStaff = null;
                let section = null;
                const parsedStaff = [];

                for (let i = 0; i < data.length; i++) {
                    const row = data[i].map(c => (c || '').trim());
                    
                    if (row.includes('STAFF INFORMATION:')) {
                        if (currentStaff) parsedStaff.push(currentStaff);
                        currentStaff = { items: [], deductions: [] };
                        section = null;
                        continue;
                    }

                    if (!currentStaff) continue;

                    if (row.includes('PAY ITEMS')) section = 'ITEMS';
                    if (row.includes('DEDUCTIONS')) section = 'DEDUCTIONS';

                    const extract = (label) => {
                        const idx = row.indexOf(label);
                        if (idx !== -1) {
                            const nextCells = row.slice(idx + 1).filter(c => c !== '');
                            return nextCells.length > 0 ? nextCells[0] : null;
                        }
                        return null;
                    };

                    ['Name:', 'Staff No.', 'Period:', 'Bank', 'Account', 'PFA', 'RSA PIN', 'TIN', 'Email'].forEach(label => {
                        const val = extract(label);
                        if (val) currentStaff[label.replace(':', '')] = val;
                    });

                    if (row[1] && !isNaN(parseInt(row[1])) && row[2]) {
                        const vals = row.slice(2).filter(c => c !== '');
                        if (vals.length >= 1) {
                            const line = {
                                name: vals[0],
                                current: vals.length > 1 ? vals[1] : '0',
                                arrears: vals.length > 2 ? vals[2] : '0',
                                total: vals.length > 3 ? vals[3] : (vals.length > 1 ? vals[1] : '0')
                            };
                            if (section === 'ITEMS') currentStaff.items.push(line);
                            else if (section === 'DEDUCTIONS') currentStaff.deductions.push(line);
                        }
                    }

                    const extractTotals = (label) => {
                        const idx = row.indexOf(label);
                        if (idx !== -1) {
                            const vals = row.slice(idx + 1).filter(v => v !== '');
                            return {
                                current: vals.length === 3 ? vals[0] : '0',
                                arrears: vals.length === 3 ? vals[1] : '0',
                                total: vals[vals.length - 1] || '0'
                            };
                        }
                        return null;
                    };

                    const gross = extractTotals('Gross Pay');
                    if (gross) currentStaff.grossPay = gross;

                    const tdeds = extractTotals('Total Deductions');
                    if (tdeds) currentStaff.totalDeductions = tdeds;

                    if (row.includes('NET PAY')) {
                        const idx = row.indexOf('NET PAY');
                        const vals = row.slice(idx + 1).filter(v => v !== '');
                        currentStaff.netPay = vals.length > 0 ? vals[vals.length - 1] : '0';
                    }
                }
                if (currentStaff) parsedStaff.push(currentStaff);

                const finalData = parsedStaff.filter(s => s.Email && s.Email.includes('@'));

                if (finalData.length === 0) {
                    onError('No valid staff payslips found in the CSV. Make sure the structure matches the template.');
                } else {
                    onProcessComplete(finalData, parsedStaff.length - finalData.length);
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
                <p className="text-slate mb-4">Extract payslip blocks directly from the CSV form export.</p>
                <div className="mb-4">
                    <Button variant="outline-light" href="/PAY_SLIP_Template.xlsx" download className="rounded-pill px-4">Download Excel Template</Button>
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
