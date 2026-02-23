import StatsCard from '../../components/StatsCard';
import StatusBadge from '../../components/StatusBadge';
import { AreaChartComponent } from '../../components/Charts';
import { loans } from '../../data/mockData';
import { formatCurrency, calculateOutstandingBalance } from '../../utils/loanEngine';
import '../pages.css';

export default function BorrowerDashboard() {
    // Emily Rivera (u4)
    const myLoans = loans.filter(l => l.borrowerId === 'u4');
    const activeLoans = myLoans.filter(l => l.status === 'active');
    const totalBorrowed = myLoans.filter(l => l.disbursedDate).reduce((s, l) => s + l.principal, 0);
    const totalPaid = myLoans.reduce((s, l) => s + l.totalPaid, 0);

    const outstanding = activeLoans.reduce((s, l) => {
        return s + calculateOutstandingBalance(l.principal, l.annualRate, l.tenureMonths, l.paidMonths);
    }, 0);

    const nextPayment = activeLoans
        .filter(l => l.nextPaymentDate)
        .sort((a, b) => new Date(a.nextPaymentDate) - new Date(b.nextPaymentDate))[0];

    // Payment history chart
    const paymentData = [];
    for (let i = 1; i <= 8; i++) {
        const d = new Date('2025-06-15');
        d.setMonth(d.getMonth() + i);
        paymentData.push({
            month: d.toLocaleString('default', { month: 'short', year: '2-digit' }),
            paid: Math.round(activeLoans.reduce((s, l) => s + l.emi, 0)),
        });
    }

    return (
        <div className="animate-fadeIn">
            <div className="page-header">
                <h1>My Loans Overview</h1>
                <p>Track your loans, payments, and outstanding balances</p>
            </div>

            <div className="stats-grid">
                <StatsCard icon="💰" label="Total Borrowed" value={formatCurrency(totalBorrowed)} color="blue" delay={0} />
                <StatsCard icon="✅" label="Total Paid" value={formatCurrency(totalPaid)} trend="On track" color="green" delay={50} />
                <StatsCard icon="📊" label="Outstanding" value={formatCurrency(outstanding)} color="yellow" delay={100} />
                <StatsCard icon="📅" label="Next Payment" value={nextPayment ? formatCurrency(nextPayment.emi) : '—'} color="purple" delay={150} />
            </div>

            <div className="content-grid">
                <div className="glass-card card-section">
                    <div className="card-section-header">
                        <h3>Payment History</h3>
                    </div>
                    <AreaChartComponent data={paymentData} dataKey="paid" xKey="month" color="#06d6a0" height={280} />
                </div>

                <div className="glass-card card-section">
                    <div className="card-section-header">
                        <h3>My Active Loans</h3>
                    </div>
                    <div className="loan-summary-list">
                        {myLoans.map(l => {
                            const progress = l.tenureMonths > 0 ? ((l.paidMonths / l.tenureMonths) * 100).toFixed(0) : 0;
                            return (
                                <div key={l.id} style={{ padding: '16px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.03)', marginBottom: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                        <div>
                                            <span style={{ fontWeight: 600, color: 'var(--accent-primary)', marginRight: '12px' }}>{l.id}</span>
                                            <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-sm)' }}>{l.purpose}</span>
                                        </div>
                                        <StatusBadge status={l.status} />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                        <span>{formatCurrency(l.principal)} @ {l.annualRate}%</span>
                                        <span>EMI: {formatCurrency(l.emi)}</span>
                                    </div>
                                    <div className="progress-bar-container">
                                        <div className="progress-bar-label">
                                            <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{l.paidMonths} / {l.tenureMonths} payments</span>
                                            <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600 }}>{progress}%</span>
                                        </div>
                                        <div className="progress-bar-track">
                                            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
