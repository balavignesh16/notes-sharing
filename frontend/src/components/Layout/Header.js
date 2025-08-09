import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { useTheme } from '../../context/ThemeContext';

const Icon = ({ path, className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);

const ThemeToggleButton = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            aria-label="Toggle dark mode"
        >
            {theme === 'light' ? (
                <Icon path="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 008.25-4.5c.203-.364.386-.742.552-1.127z" />
            ) : (
                <Icon path="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            )}
        </button>
    );
};

export default function Header({ user }) {
    const navigate = useNavigate();
    const handleSignOut = async () => {
        await signOut(auth);
        navigate('/login');
    };

    const activeLinkStyle = { backgroundColor: '#EEF2FF', color: '#4338CA' };
    const darkActiveLinkStyle = { backgroundColor: '#3730A3', color: '#E0E7FF' };
    const { theme } = useTheme();

    return (
        <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                <NavLink to="/" className="flex-shrink-0 flex items-center gap-2 text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    <Icon path="M12 6.253v11.494m-5.747-8.994l11.494 0" className="w-8 h-8" />
                    <span>NoteShare</span>
                </NavLink>
                <div className="hidden md:flex items-center space-x-4">
                    {user ? (
                        <>
                            <NavLink to="/dashboard" style={({ isActive }) => isActive ? (theme === 'dark' ? darkActiveLinkStyle : activeLinkStyle) : undefined} className="text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">Dashboard</NavLink>
                            <NavLink to="/upload" style={({ isActive }) => isActive ? (theme === 'dark' ? darkActiveLinkStyle : activeLinkStyle) : undefined} className="text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">Upload Note</NavLink>
                            <NavLink to="/profile" style={({ isActive }) => isActive ? (theme === 'dark' ? darkActiveLinkStyle : activeLinkStyle) : undefined} className="text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">Profile</NavLink>
                            <button onClick={handleSignOut} className="bg-red-500 text-white hover:bg-red-600 px-3 py-2 rounded-md text-sm font-medium">Sign Out</button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login" className="text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">Login</NavLink>
                            <NavLink to="/signup" className="bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium">Sign Up</NavLink>
                        </>
                    )}
                    <ThemeToggleButton />
                </div>
            </nav>
        </header>
    );
}
