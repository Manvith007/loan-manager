import { useState } from 'react';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import { loans } from '../../data/mockData';
import { generateAmortizationSchedule, formatCurrency, formatCurrencyExact, formatDate } from '../../utils/loanEngine';
import '../pages.css';

export default function PaymentSchedule() {
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [paymentModal, setPaymentModal] = useState(false);

    const myLoans = loans.filter(l => l.borrowerId === 'u4' && l.status === 'active');
    const currentLoan = selectedLoan || myLoans[0];

    const schedule = currentLoan
        ? generateAmortizationSchedule(currentLoan.principal, currentLoan.annualRate, currentLoan.tenureMonths, new Date(currentLoan.disbursedDate))
        : [];

    // Mark paid months
    const displaySchedule = schedule.map((row, idx) => ({
        ...row,
        status: idx < currentLoan?.paidMonths ? 'paid' : idx === currentLoan?.paidMonths ? 'upcoming' : 'pending',
    }));

    return (
        <div className="animate-fadeIn">
            <div className="page-header">
                <h1>Payment Schedule</h1>
                <p>View your amortization schedule and make payments</p>
            </div>

            {/* Loan Selector */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                {myLoans.map(l => (
                    <button
                        key={l.id}
                        className={`btn ${currentLoan?.id === l.id ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                        onClick={() => setSelectedLoan(l)}
                    >
                        {l.id} — {l.purpose} ({formatCurrency(l.principal)})
                    </button>
                ))}
            </div>

            {currentLoan && (
                <>
                    {/* Loan Summary */}
                    <div className="glass-card card-section" style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                            <div>
                                <h3>{currentLoan.purpose}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-sm)' }}>
                                    {formatCurrency(currentLoan.principal)} @ {currentLoan.annualRate}% for {currentLoan.tenureMonths} months
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginBottom: '2px' }}>Monthly EMI</div>
                                    <div style={{ fontWeight: 700, color: 'var(--accent-primary)', fontSize: 'var(--font-lg)' }}>{formatCurrencyExact(currentLoan.emi)}</div>
                                </div>
                                <button className="btn btn-primary" onClick={() => setPaymentModal(true)}>
                                    Make Payment
                                </button>
                            </div>
                        </div>

                        <div className="progress-bar-container" style={{ marginTop: '16px' }}>
                            <div className="progress-bar-label">
                                <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
                                    {currentLoan.paidMonths} of {currentLoan.tenureMonths} payments completed
                                </span>
                                <span style={{ fontSize: 'var(--font-sm)', fontWeight: 600 }}>
                                    {((currentLoan.paidMonths / currentLoan.tenureMonths) * 100).toFixed(0)}%
                                </span>
                            </div>
                            <div className="progress-bar-track">
                                <div className="progress-bar-fill" style={{ width: `${(currentLoan.paidMonths / currentLoan.tenureMonths) * 100}%` }} />
                            </div>
                        </div>
                    </div>

                    {/* Schedule Table */}
                    <div className="glass-card card-section">
                        <div className="card-section-header">
                            <h3>Amortization Schedule</h3>
                        </div>
                        <DataTable
                            columns={[
                                { key: 'month', label: '#' },
                                { key: 'dueDate', label: 'Due Date', render: v => formatDate(v) },
                                { key: 'emi', label: 'EMI', render: v => formatCurrencyExact(v) },
                                { key: 'principal', label: 'Principal', render: v => formatCurrencyExact(v) },
                                { key: 'interest', label: 'Interest', render: v => formatCurrencyExact(v) },
                                { key: 'balance', label: 'Balance', render: v => formatCurrency(v) },
                                { key: 'status', label: 'Status', render: v => <StatusBadge status={v} /> },
                            ]}
                            data={displaySchedule}
                            pageSize={12}
                        />
                    </div>
                </>
            )}

            <Modal
                isOpen={paymentModal}
                onClose={() => setPaymentModal(false)}
                title="Make Payment"
                footer={
                    <>
                        <button className="btn btn-secondary btn-sm" onClick={() => setPaymentModal(false)}>Cancel</button>
                        <button className="btn btn-primary btn-sm" onClick={() => setPaymentModal(false)}>Confirm Payment</button>
                    </>
                }
            >
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>💳</div>
                    <p style={{ marginBottom: '8px' }}>You are about to make a payment of</p>
                    <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '16px' }}>
                        {currentLoan ? formatCurrencyExact(currentLoan.emi) : '—'}
                    </div>
                    <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>
                        for Loan {currentLoan?.id} — {currentLoan?.purpose}
                    </p>
                </div>
            </Modal>
        </div>
    );
}
