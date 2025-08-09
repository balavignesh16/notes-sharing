import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    // Default to 'light' if no preference is found or if the value is invalid
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : 'light';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        
        // Remove the old theme class before adding the new one
        root.classList.remove(theme === 'dark' ? 'light' : 'dark');
        root.classList.add(theme);
        
        // Save the user's preference
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
