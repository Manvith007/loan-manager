import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const roles = [
    {
        role: 'admin',
        icon: '🛡️',
        title: 'Admin',
        desc: 'Oversee platform operations, manage user accounts, and ensure data security.',
    },
    {
        role: 'lender',
        icon: '💼',
        title: 'Lender',
        desc: 'Create loan offers, track payments, and manage borrower interactions.',
    },
    {
        role: 'borrower',
        icon: '🏠',
        title: 'Borrower',
        desc: 'Apply for loans, track payment schedules, and manage loan details.',
    },
    {
        role: 'analyst',
        icon: '📊',
        title: 'Financial Analyst',
        desc: 'Analyze loan data, assess risks, and generate financial reports.',
    },
];

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = (role) => {
        const user = login(role);
        if (user) {
            const paths = { admin: '/admin', lender: '/lender', borrower: '/borrower', analyst: '/analyst' };
            navigate(paths[role]);
        }
    };

    return (
        <div className="login-page">
            <div className="login-bg">
                <div className="orb orb-1" />
                <div className="orb orb-2" />
                <div className="orb orb-3" />
            </div>

            <div className="login-container">
                <div className="login-logo">
                    <div className="logo-icon">L</div>
                    <h1>LoanPro</h1>
                </div>

                <p className="login-subtitle">
                    Track and manage the loan issuance process with ease. Select your role to get started.
                </p>

                <div className="login-roles">
                    {roles.map(r => (
                        <div
                            key={r.role}
                            className={`role-card glass-card ${r.role}`}
                            onClick={() => handleLogin(r.role)}
                        >
                            <div className="role-card-icon">{r.icon}</div>
                            <h3>{r.title}</h3>
                            <p>{r.desc}</p>
                            <span className="role-arrow">→</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
