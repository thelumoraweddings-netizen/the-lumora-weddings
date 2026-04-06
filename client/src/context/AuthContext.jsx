import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAdmin(true);
        }
        setLoading(false);
    }, []);

    const login = (password) => {
        // Basic verification for demo
        if (password === 'admin123') {
            localStorage.setItem('token', 'fake-jwt-token');
            setIsAdmin(true);
            return true;
        }
        return false;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsAdmin(false);
    };

    return (
        <AuthContext.Provider value={{ isAdmin, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
