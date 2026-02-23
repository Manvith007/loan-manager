import StatsCard from '../../components/StatsCard';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import { AreaChartComponent } from '../../components/Charts';
import { loans, monthlyData } from '../../data/mockData';
import { formatCurrency } from '../../utils/loanEngine';
import '../pages.css';

export default function LenderDashboard() {
    // Sarah Wellington's (u2) portfolio
    const myLoans = loans.filter(l => l.lenderId === 'u2');
    const activeLoans = myLoans.filter(l => l.status === 'active' || l.status === 'overdue');
    const totalLent = myLoans.filter(l => l.disbursedDate).reduce((s, l) => s + l.principal, 0);
    const totalEarnings = myLoans.reduce((s, l) => s + l.totalPaid, 0);
    const avgReturn = myLoans.length > 0
        ? (myLoans.reduce((s, l) => s + l.annualRate, 0) / myLoans.length).toFixed(1)
        : 0;

    return (
        <div className="animate-fadeIn">
            <div className="page-header">
                <h1>Lending Portfolio</h1>
                <p>Track your investments and manage borrower interactions</p>
            </div>

            <div className="stats-grid">
                <StatsCard icon="💰" label="Total Lent" value={formatCurrency(totalLent)} trend="18%" color="green" delay={0} />
                <StatsCard icon="📋" label="Active Loans" value={activeLoans.length} trend="3" color="blue" delay={50} />
                <StatsCard icon="📈" label="Total Earnings" value={formatCurrency(totalEarnings)} trend="12%" color="purple" delay={100} />
                <StatsCard icon="📊" label="Avg Return" value={`${avgReturn}%`} color="yellow" delay={150} />
            </div>

            <div className="content-grid">
                <div className="glass-card card-section">
                    <div className="card-section-header">
                        <h3>Portfolio Performance</h3>
                    </div>
                    <AreaChartComponent data={monthlyData} dataKey="repaid" color="#06d6a0" height={280} />
                </div>

                <div className="glass-card card-section">
                    <div className="card-section-header">
                        <h3>Active Loans Summary</h3>
                    </div>
                    <div className="loan-summary-list">
                        {activeLoans.map(l => (
                            <div className="loan-summary-item" key={l.id}>
                                <div className="loan-summary-info">
                                    <span className="loan-id">{l.id}</span>
                                    <span className="loan-purpose">{l.borrowerName} — {l.purpose}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <StatusBadge status={l.status} />
                                    <span className="loan-summary-amount">{formatCurrency(l.principal)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="glass-card card-section">
                <div className="card-section-header">
                    <h3>All My Loans</h3>
                </div>
                <DataTable
                    columns={[
                        { key: 'id', label: 'Loan ID' },
                        { key: 'borrowerName', label: 'Borrower' },
                        { key: 'type', label: 'Type' },
                        { key: 'principal', label: 'Principal', render: v => formatCurrency(v) },
                        { key: 'annualRate', label: 'Rate', render: v => `${v}%` },
                        { key: 'emi', label: 'EMI', render: v => formatCurrency(v) },
                        { key: 'totalPaid', label: 'Received', render: v => formatCurrency(v) },
                        { key: 'status', label: 'Status', render: v => <StatusBadge status={v} /> },
                    ]}
                    data={myLoans}
                    pageSize={8}
                />
            </div>
        </div>
    );
}
