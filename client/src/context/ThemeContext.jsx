import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Lock to Light Theme (isDarkMode = false)
    const [isDarkMode] = useState(false);

    useEffect(() => {
        // Force Light Theme on document
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }, []);

    const toggleTheme = () => {
        // Theme switching disabled as per user request
        console.log("Theme switching is disabled.");
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
