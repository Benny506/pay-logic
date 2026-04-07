-- PayLogic: Automated Staff Payroll System Schema

-- 1. Employees Table
CREATE TABLE IF NOT EXISTS pay_employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    department TEXT NOT NULL,
    job_title TEXT NOT NULL,
    base_salary DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    bank_name TEXT,
    account_number TEXT,
    join_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Payroll Runs Table (Batch tracking)
CREATE TABLE IF NOT EXISTS pay_payroll_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    month INTEGER NOT NULL, -- 1-12
    year INTEGER NOT NULL,
    total_payout DECIMAL(15, 2) DEFAULT 0.00,
    status TEXT DEFAULT 'Draft', -- Draft, Processing, Completed
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Individual Transactions Table (Payslip records)
CREATE TABLE IF NOT EXISTS pay_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES pay_employees(id) ON DELETE CASCADE,
    run_id UUID REFERENCES pay_payroll_runs(id) ON DELETE SET NULL,
    gross_pay DECIMAL(12, 2) NOT NULL,
    tax_deduction DECIMAL(12, 2) DEFAULT 0.00,
    insurance_deduction DECIMAL(12, 2) DEFAULT 0.00,
    net_pay DECIMAL(12, 2) NOT NULL,
    payment_date TIMESTAMPTZ DEFAULT NOW(),
    month INTEGER NOT NULL,
    year INTEGER NOT NULL
);

-- Indices for faster lookup
CREATE INDEX IF NOT EXISTS idx_pay_employees_dept ON pay_employees(department);
CREATE INDEX IF NOT EXISTS idx_pay_transactions_emp ON pay_transactions(employee_id);
CREATE INDEX IF NOT EXISTS idx_pay_transactions_run ON pay_transactions(run_id);
