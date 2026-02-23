import StatsCard from '../../components/StatsCard';
import { PieChartComponent, BarChartComponent, LineChartComponent } from '../../components/Charts';
import { loans, loanTypeDistribution, monthlyData, riskData } from '../../data/mockData';
import { formatCurrency } from '../../utils/loanEngine';
import '../pages.css';

export default function AnalystDashboard() {
    const totalPortfolio = loans.filter(l => l.disbursedDate).reduce((s, l) => s + l.principal, 0);
    const activeLoans = loans.filter(l => l.status === 'active');
    const nplRatio = ((loans.filter(l => l.status === 'defaulted' || l.status === 'overdue').length / loans.length) * 100).toFixed(1);
    const avgRate = (loans.reduce((s, l) => s + l.annualRate, 0) / loans.length).toFixed(2);

    const riskDistribution = [
        { name: 'Low Risk', value: riskData.filter(r => r.riskScore >= 80).length, fill: '#06d6a0' },
        { name: 'Medium Risk', value: riskData.filter(r => r.riskScore >= 60 && r.riskScore < 80).length, fill: '#ffd166' },
        { name: 'High Risk', value: riskData.filter(r => r.riskScore >= 40 && r.riskScore < 60).length, fill: '#ef476f' },
        { name: 'Very High', value: riskData.filter(r => r.riskScore < 40).length, fill: '#d62828' },
    ].filter(r => r.value > 0);

    return (
        <div className="animate-fadeIn">
            <div className="page-header">
                <h1>Portfolio Analytics</h1>
                <p>Comprehensive analysis of loan performance and risk metrics</p>
            </div>

            <div className="stats-grid">
                <StatsCard icon="💼" label="Total Portfolio" value={formatCurrency(totalPortfolio)} trend="12%" color="green" delay={0} />
                <StatsCard icon="⚠️" label="NPL Ratio" value={`${nplRatio}%`} trend="1.2%" trendDir="down" color="red" delay={50} />
                <StatsCard icon="📊" label="Avg Interest Rate" value={`${avgRate}%`} color="blue" delay={100} />
                <StatsCard icon="✅" label="Active Loans" value={activeLoans.length} trend="3" color="purple" delay={150} />
            </div>

            <div className="content-grid">
                <div className="glass-card card-section">
                    <div className="card-section-header">
                        <h3>Monthly Disbursement vs Repayment</h3>
                    </div>
                    <BarChartComponent
                        data={monthlyData}
                        dataKey="disbursed"
                        secondDataKey="repaid"
                        color="#6366f1"
                        secondColor="#06d6a0"
                        height={300}
                    />
                </div>

                <div className="glass-card card-section">
                    <div className="card-section-header">
                        <h3>Loan Type Distribution</h3>
                    </div>
                    <PieChartComponent data={loanTypeDistribution} height={300} />
                </div>
            </div>

            <div className="content-grid">
                <div className="glass-card card-section">
                    <div className="card-section-header">
                        <h3>Default Trends</h3>
                    </div>
                    <LineChartComponent
                        data={monthlyData}
                        xKey="month"
                        lines={[
                            { dataKey: 'repaid', color: '#06d6a0' },
                            { dataKey: 'defaults', color: '#ef476f' },
                        ]}
                        height={280}
                    />
                </div>

                <div className="glass-card card-section">
                    <div className="card-section-header">
                        <h3>Risk Distribution</h3>
                    </div>
                    <PieChartComponent data={riskDistribution} height={280} />
                </div>
            </div>
        </div>
    );
}
