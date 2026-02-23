import { createContext, useContext, useState } from 'react';
import { users } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);

    const login = (role) => {
        const user = users.find(u => u.role === role && u.status === 'active');
        if (user) setCurrentUser(user);
        return user;
    };

    const loginAsUser = (userId) => {
        const user = users.find(u => u.id === userId);
        if (user) setCurrentUser(user);
        return user;
    };

    const logout = () => setCurrentUser(null);

    const isAuthenticated = !!currentUser;

    return (
        <AuthContext.Provider value={{ currentUser, login, loginAsUser, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
