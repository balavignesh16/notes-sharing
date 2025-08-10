import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { ProfileProvider } from './context/ProfileContext';
import { AuthProvider } from './context/AuthContext'; // <-- IMPORT THE NEW PROVIDER

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider> {/* <-- WRAP EVERYTHING IN AUTHPROVIDER */}
      <ThemeProvider>
        <ProfileProvider>
          <App />
        </ProfileProvider>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);