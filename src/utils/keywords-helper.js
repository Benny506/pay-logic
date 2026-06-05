/**
 * Expected CSV Column Headers (Keywords) for Bulk Email Tool
 * 
 * The CSV file uploaded must contain exactly the following column headers 
 * (case-insensitive, but must match these keywords):
 * 
 * 1. Name         - Employee's full name
 * 2. Email        - Employee's email address
 * 3. Month        - The payroll month
 * 4. Year         - The payroll year
 * 5. Total Salary - The gross base salary 
 * 6. Tax          - The tax deduction amount
 * 7. Insurance    - The insurance deduction amount
 * 8. Pension      - The pension deduction amount
 * 9. Net Payout   - (Optional/Ignored) The net payout. Our system calculates this internally to ensure accuracy.
 * 
 * If these required columns are missing, the CSV parsing will fail with a human-friendly error.
 */

export const REQUIRED_CSV_HEADERS = [
    'Name',
    'Email',
    'Month',
    'Year',
    'Total Salary',
    'Tax',
    'Insurance',
    'Pension'
];
