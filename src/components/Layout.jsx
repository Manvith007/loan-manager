import { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

const navConfig = {
    admin: {
        label: 'Administration',
        links: [
            { to: '/admin', icon: '📊', label: 'Dashboard', end: true },
            { to: '/admin/users', icon: '👥', label: 'User Management' },
            { to: '/admin/loans', icon: '📋', label: 'Loan Oversight' },
        ],
    },
    lender: {
        label: 'Lending',
        links: [
            { to: '/lender', icon: '📊', label: 'Dashboard', end: true },
            { to: '/lender/create', icon: '➕', label: 'Create Loan Offer' },
            { to: '/lender/payments', icon: '💰', label: 'Payment Tracking' },
        ],
    },
    borrower: {
        label: 'Borrowing',
        links: [
            { to: '/borrower', icon: '📊', label: 'Dashboard', end: true },
            { to: '/borrower/apply', icon: '📝', label: 'Apply for Loan' },
            { to: '/borrower/schedule', icon: '📅', label: 'Payment Schedule' },
        ],
    },
    analyst: {
        label: 'Analytics',
        links: [
            { to: '/analyst', icon: '📊', label: 'Dashboard', end: true },
            { to: '/analyst/risk', icon: '⚠️', label: 'Risk Assessment' },
            { to: '/analyst/reports', icon: '📈', label: 'Reports' },
        ],
    },
};

const pageTitles = {
    '/admin': 'Admin Dashboard',
    '/admin/users': 'User Management',
    '/admin/loans': 'Loan Oversight',
    '/lender': 'Lender Dashboard',
    '/lender/create': 'Create Loan Offer',
    '/lender/payments': 'Payment Tracking',
    '/borrower': 'Borrower Dashboard',
    '/borrower/apply': 'Loan Application',
    '/borrower/schedule': 'Payment Schedule',
    '/analyst': 'Analyst Dashboard',
    '/analyst/risk': 'Risk Assessment',
    '/analyst/reports': 'Financial Reports',
};

export default function Layout() {
    const { currentUser, logout } = useAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const role = currentUser?.role;
    const nav = navConfig[role];
    const pageTitle = pageTitles[location.pathname] || 'Dashboard';

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    return (
        <div className="layout-wrapper">
            {/* Mobile Backdrop */}
            {sidebarOpen && (
                <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
                <div className="sidebar-logo">
                    <div className="logo-icon">L</div>
                    <h2>LoanPro</h2>
                </div>

                <nav className="sidebar-nav">
                    {nav && (
                        <>
                            <div className="nav-section-label">{nav.label}</div>
                            {nav.links.map(link => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    end={link.end}
                                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <span className="nav-icon">{link.icon}</span>
                                    <span className="nav-label">{link.label}</span>
                                </NavLink>
                            ))}
                        </>
                    )}
                </nav>

                <div className="sidebar-user">
                    <div className="sidebar-user-card">
                        <div className="sidebar-user-avatar">{currentUser?.avatar}</div>
                        <div className="sidebar-user-info">
                            <div className="sidebar-user-name">{currentUser?.name}</div>
                            <div className="sidebar-user-role">{currentUser?.role}</div>
                        </div>
                        <button className="sidebar-logout" onClick={logout} title="Logout">
                            ⏻
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="top-header">
                    <div className="header-left">
                        <button
                            className="hamburger-btn"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            aria-label="Toggle menu"
                        >
                            <span className="hamburger-line" />
                            <span className="hamburger-line" />
                            <span className="hamburger-line" />
                        </button>
                        <h2>{pageTitle}</h2>
                    </div>
                    <div className="header-right">
                        <span className={`header-badge ${role}`}>{role}</span>
                        <button className="header-notification">
                            🔔
                            <span className="notification-dot" />
                        </button>
                    </div>
                </header>

                <div className="page-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
