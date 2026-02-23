import { useState, useMemo } from 'react';
import { calculateEMI, calculateTotalInterest, formatCurrency, formatCurrencyExact } from '../../utils/loanEngine';
import '../pages.css';

export default function LoanApplication() {
    const [form, setForm] = useState({
        type: 'Personal',
        amount: 20000,
        tenure: 36,
        purpose: '',
        income: 95000,
        employment: 'Full-time',
    });
    const [submitted, setSubmitted] = useState(false);

    const update = (key, val) => setForm(p => ({ ...p, [key]: val }));

    // Simulated rate based on amount + credit score
    const estimatedRate = useMemo(() => {
        if (form.amount <= 10000) return 7.5;
        if (form.amount <= 50000) return 9.0;
        if (form.amount <= 200000) return 6.5;
        return 5.0;
    }, [form.amount]);

    const emi = useMemo(() => calculateEMI(form.amount, estimatedRate, form.tenure), [form.amount, estimatedRate, form.tenure]);
    const totalInterest = useMemo(() => calculateTotalInterest(form.amount, estimatedRate, form.tenure), [form.amount, estimatedRate, form.tenure]);
    const dti = form.income > 0 ? ((emi * 12) / form.income * 100).toFixed(1) : 0;
    const eligible = dti < 45;

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    return (
        <div className="animate-fadeIn">
            <div className="page-header">
                <h1>Apply for a Loan</h1>
                <p>Check your eligibility and submit a loan application</p>
            </div>

            <div className="content-grid">
                <div className="glass-card card-section">
                    <h3 style={{ marginBottom: '24px' }}>Application Details</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Loan Type</label>
                                <select value={form.type} onChange={e => update('type', e.target.value)}>
                                    <option>Personal</option>
                                    <option>Auto</option>
                                    <option>Mortgage</option>
                                    <option>Education</option>
                                    <option>Business</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Purpose</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Home Renovation"
                                    value={form.purpose}
                                    onChange={e => update('purpose', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Loan Amount: {formatCurrency(form.amount)}</label>
                            <input
                                type="range"
                                min="1000"
                                max="500000"
                                step="1000"
                                value={form.amount}
                                onChange={e => update('amount', Number(e.target.value))}
                                style={{ accentColor: 'var(--accent-primary)' }}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Tenure: {form.tenure} months</label>
                                <input
                                    type="range"
                                    min="6"
                                    max="360"
                                    step="6"
                                    value={form.tenure}
                                    onChange={e => update('tenure', Number(e.target.value))}
                                    style={{ accentColor: 'var(--accent-primary)' }}
                                />
                            </div>
                            <div className="form-group">
                                <label>Annual Income</label>
                                <input
                                    type="number"
                                    value={form.income}
                                    onChange={e => update('income', Number(e.target.value))}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Employment Status</label>
                            <select value={form.employment} onChange={e => update('employment', e.target.value)}>
                                <option>Full-time</option>
                                <option>Part-time</option>
                                <option>Self-employed</option>
                                <option>Freelancer</option>
                            </select>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary" disabled={!eligible || submitted}>
                                {submitted ? '✓ Application Submitted!' : eligible ? 'Submit Application' : 'Not Eligible'}
                            </button>
                        </div>
                    </form>
                </div>

                <div>
                    <div className="glass-card card-section" style={{ marginBottom: '24px' }}>
                        <h3 style={{ marginBottom: '16px', color: 'var(--accent-primary)' }}>Eligibility Check</h3>
                        <div style={{
                            padding: '16px',
                            borderRadius: 'var(--radius-md)',
                            background: eligible ? 'var(--accent-primary-dim)' : 'var(--accent-danger-dim)',
                            border: `1px solid ${eligible ? 'rgba(6,214,160,0.3)' : 'rgba(239,71,111,0.3)'}`,
                            textAlign: 'center',
                            marginBottom: '16px'
                        }}>
                            <div style={{ fontSize: '32px', marginBottom: '8px' }}>{eligible ? '✅' : '❌'}</div>
                            <div style={{ fontWeight: 700, fontSize: 'var(--font-md)' }}>
                                {eligible ? 'You are eligible!' : 'DTI ratio too high'}
                            </div>
                            <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                Debt-to-Income: {dti}% {eligible ? '(< 45%)' : '(≥ 45%)'}
                            </div>
                        </div>
                    </div>

                    <div className="glass-card card-section">
                        <h3 style={{ marginBottom: '16px' }}>Loan Preview</h3>
                        <div className="preview-box" style={{ marginTop: 0 }}>
                            <div className="preview-row">
                                <span className="preview-label">Estimated Rate</span>
                                <span className="preview-value">{estimatedRate}%</span>
                            </div>
                            <div className="preview-row">
                                <span className="preview-label">Monthly EMI</span>
                                <span className="preview-value" style={{ color: 'var(--accent-primary)' }}>{formatCurrencyExact(emi)}</span>
                            </div>
                            <div className="preview-row">
                                <span className="preview-label">Total Interest</span>
                                <span className="preview-value">{formatCurrency(totalInterest)}</span>
                            </div>
                            <div className="preview-row">
                                <span className="preview-label">Total Repayment</span>
                                <span className="preview-value">{formatCurrency(form.amount + totalInterest)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
