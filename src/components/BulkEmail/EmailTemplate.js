export const generatePdfHTML = (staff) => {
    const trs = (items) => (items || []).map(i => `
        <tr>
            <td>${i.name}</td>
            <td class="amount">${i.current}</td>
            <td class="amount">${i.arrears}</td>
            <td class="amount fw-bold">${i.total}</td>
        </tr>
    `).join('');

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Pay Slip</title>
        </head>
        <body>
            <style>
                * { box-sizing: border-box; }
                body { font-family: 'Inter', Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6; margin: 0; padding: 0; background-color: #f8fafc; }
                .container { max-width: 800px; margin: 40px auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
                .header { background: linear-gradient(135deg, #10b981 0%, #065f46 100%); padding: 40px; color: white; text-align: center; }
                .info-label { font-weight: 700; color: #64748b; }
                .content { padding: 40px; }
                table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 30px; font-size: 14px; }
                th, td { text-align: left; padding: 12px; border-bottom: 1px solid #f1f5f9; }
                th { font-size: 12px; text-transform: uppercase; color: #64748b; border-bottom: 2px solid #e2e8f0; background: #f8fafc; }
                .amount { text-align: right; }
                .fw-bold { font-weight: 700; }
                .text-emerald { color: #10b981; }
                .text-danger { color: #ef4444; }
                .total-row td { font-weight: 800; background: #f1f5f9; border-top: 2px solid #cbd5e1; }
                .footer { padding: 30px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
            </style>
            <div class="container">
                <div class="header">
                    <h1 style="margin: 0; font-size: 28px; font-weight: 800;">Pay Slip</h1>
                    <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 16px;">Period: <strong>${staff.Period || ''}</strong></p>
                </div>
                <div class="content">
                    <h3 style="margin-top: 0; font-weight: 800; color: #0f172a;">Staff Information</h3>
                    <table>
                        <thead><tr><th>Detail</th><th>Information</th><th>Detail</th><th>Information</th></tr></thead>
                        <tbody>
                            <tr>
                                <td class="info-label">Name</td><td>${staff.Name || ''}</td>
                                <td class="info-label">PFA</td><td>${staff.PFA || ''}</td>
                            </tr>
                            <tr>
                                <td class="info-label">Staff No.</td><td>${staff['Staff No.'] || ''}</td>
                                <td class="info-label">RSA PIN</td><td>${staff['RSA PIN'] || ''}</td>
                            </tr>
                            <tr>
                                <td class="info-label">Bank</td><td>${staff.Bank || ''}</td>
                                <td class="info-label">TIN</td><td>${staff.TIN || ''}</td>
                            </tr>
                            <tr>
                                <td class="info-label">Account</td><td>${staff.Account || ''}</td>
                                <td class="info-label">Email</td><td>${staff.Email || ''}</td>
                            </tr>
                        </tbody>
                    </table>

                    <h3 style="margin-top: 20px; font-weight: 800; color: #0f172a;">Earnings</h3>
                    <table>
                        <thead><tr><th>Pay Items</th><th class="amount">Current</th><th class="amount">Arrears</th><th class="amount">Total Amount</th></tr></thead>
                        <tbody>
                            ${trs(staff.items)}
                            <tr class="total-row">
                                <td>Gross Pay</td>
                                <td class="amount">${staff.grossPay?.current || ''}</td>
                                <td class="amount">${staff.grossPay?.arrears || ''}</td>
                                <td class="amount text-emerald">${staff.grossPay?.total || ''}</td>
                            </tr>
                        </tbody>
                    </table>

                    <h3 style="margin-top: 20px; font-weight: 800; color: #0f172a;">Deductions</h3>
                    <table>
                        <thead><tr><th>Pay Items</th><th class="amount">Current</th><th class="amount">Arrears</th><th class="amount">Total Amount</th></tr></thead>
                        <tbody>
                            ${trs(staff.deductions)}
                            <tr class="total-row">
                                <td>Total Deductions</td>
                                <td class="amount">${staff.totalDeductions?.current || ''}</td>
                                <td class="amount">${staff.totalDeductions?.arrears || ''}</td>
                                <td class="amount text-danger">${staff.totalDeductions?.total || ''}</td>
                            </tr>
                        </tbody>
                    </table>

                    <h3 style="margin-top: 20px; font-weight: 800; color: #0f172a;">Net Pay</h3>
                    <table>
                        <thead><tr><th>Description</th><th class="amount">Total Amount</th></tr></thead>
                        <tbody>
                            <tr class="total-row">
                                <td>Net Payable</td>
                                <td class="amount text-emerald" style="font-size: 18px;">₦${staff.netPay || '0'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="footer">&copy; 2026 PayLogic Systems. Automated encrypted statement.</div>
            </div>
        </body>
        </html>
    `;
};

export const generateEmailHTML = (staff) => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Payroll Statement</title>
        </head>
        <body style="font-family: 'Inter', Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6; margin: 0; padding: 0; background-color: #f8fafc;">
            <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
                <div style="background: linear-gradient(135deg, #10b981 0%, #065f46 100%); padding: 30px; color: white; text-align: center;">
                    <h2 style="margin: 0; font-weight: 800;">Payroll Statement</h2>
                    <p style="margin: 5px 0 0 0; opacity: 0.9;">Period: <strong>${staff.Period || ''}</strong></p>
                </div>
                <div style="padding: 40px;">
                    <p>Hello <strong>${staff.Name || 'Staff'}</strong>,</p>
                    <p>Your payroll statement for the period of <strong>${staff.Period || ''}</strong> has been securely processed and is ready for your review.</p>
                    
                    <div style="background: #f1f5f9; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
                        <div style="font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 5px;">Net Pay</div>
                        <div style="font-size: 28px; font-weight: 800; color: #10b981;">₦${staff.netPay || '0'}</div>
                    </div>

                    <p style="margin-bottom: 0;">For a complete breakdown of your earnings and deductions, please see the <strong>secure PDF document attached</strong> to this email.</p>
                </div>
                <div style="padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9;">
                    &copy; 2026 PayLogic Systems. Automated encrypted statement.
                </div>
            </div>
        </body>
        </html>
    `;
};
