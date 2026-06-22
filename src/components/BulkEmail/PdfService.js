import html2pdf from 'html2pdf.js';
import { generatePdfHTML } from './EmailTemplate';

const getOpt = (filename) => ({
    margin:       10,
    filename:     filename,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true, logging: false },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
});

export const downloadLocalPDF = async (member) => {
    const html = generatePdfHTML(member);
    const filename = `${(member.Name || 'Staff').replace(/\\s+/g, '_')}_Payslip.pdf`;
    await html2pdf().set(getOpt(filename)).from(html).save();
};

export const generatePDFBase64 = async (member) => {
    const htmlString = generatePdfHTML(member);
    const pdfBase64 = await html2pdf().set(getOpt('payslip.pdf')).from(htmlString).outputPdf('datauristring');
    return pdfBase64.split(',')[1];
};
