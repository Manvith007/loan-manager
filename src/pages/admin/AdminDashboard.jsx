import StatsCard from '../../components/StatsCard';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import { AreaChartComponent, PieChartComponent } from '../../components/Charts';
import { loans, users, monthlyData, loanTypeDistribution, activityFeed } from '../../data/mockData';
import { formatCurrency } from '../../utils/loanEngine';
import '../pages.css';

export default function AdminDashboard() {
    const totalLoans = loans.length;
    const activeLoans = loans.filter(l => l.status === 'active').length;
    const totalDisbursed = loans.filter(l => l.disbursedDate).reduce((s, l) => s + l.principal, 0);
    const defaultRate = ((loans.filter(l => l.status === 'defaulted').length / totalLoans) * 100).toFixed(1);
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === 'active').length;

    const recentLoans = [...loans].slice(0, 5);

    return (
        <div className="animate-fadeIn">
            <div className="page-header">
                <h1>Platform Overview</h1>
                <p>Monitor platform performance and manage operations</p>
            </div>

            <div className="stats-grid">
                <StatsCard icon="📋" label="Total Loans" value={totalLoans} trend="12%" color="green" delay={0} />
                <StatsCard icon="✅" label="Active Loans" value={activeLoans} trend="8%" color="blue" delay={50} />
                <StatsCard icon="💰" label="Total Disbursed" value={formatCurrency(totalDisbursed)} trend="15%" color="purple" delay={100} />
                <StatsCard icon="⚠️" label="Default Rate" value={`${defaultRate}%`} trend="2.1%" trendDir="down" color="red" delay={150} />
            </div>

            <div className="content-grid">
                <div className="glass-card card-section">
                    <div className="card-section-header">
                        <h3>Monthly Disbursement & Repayment</h3>
                    </div>
                    <AreaChartComponent
                        data={monthlyData}
                        dataKey="repaid"
                        secondDataKey="disbursed"
                        color="#06d6a0"
                        secondColor="#6366f1"
                        height={280}
                    />
                </div>

                <div className="glass-card card-section">
                    <div className="card-section-header">
                        <h3>Loan Distribution by Type</h3>
                    </div>
                    <PieChartComponent data={loanTypeDistribution} height={280} />
                </div>
            </div>

            <div className="content-grid">
                <div className="glass-card card-section">
                    <div className="card-section-header">
                        <h3>Recent Loans</h3>
                    </div>
                    <DataTable
                        columns={[
                            { key: 'id', label: 'Loan ID' },
                            { key: 'borrowerName', label: 'Borrower' },
                            { key: 'type', label: 'Type' },
                            { key: 'principal', label: 'Amount', render: v => formatCurrency(v) },
                            { key: 'status', label: 'Status', render: v => <StatusBadge status={v} /> },
                        ]}
                        data={recentLoans}
                        pageSize={5}
                    />
                </div>

                <div className="glass-card activity-feed">
                    <div className="card-section-header">
                        <h3>Recent Activity</h3>
                    </div>
                    {activityFeed.map(item => (
                        <div className="activity-item" key={item.id}>
                            <div className={`activity-dot ${item.type}`} />
                            <div className="activity-text">{item.text}</div>
                            <div className="activity-time">{item.time}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <StatsCard icon="👥" label="Total Users" value={totalUsers} color="blue" delay={200} />
                <StatsCard icon="✅" label="Active Users" value={activeUsers} color="green" delay={250} />
                <StatsCard icon="📊" label="Avg Loan Size" value={formatCurrency(totalDisbursed / totalLoans)} color="purple" delay={300} />
            </div>
        </div>
    );
}
