import React, { createContext, useContext } from 'react';
import useAuthHook from '../hooks/useAuth'; // We rename the import to avoid naming conflicts

const AuthContext = createContext(null);

// This is the hook that components will use to get auth state
export const useAuth = () => useContext(AuthContext);

// This is the provider component that will wrap our app
export const AuthProvider = ({ children }) => {
    const auth = useAuthHook();
    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
};