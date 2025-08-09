// ====================================================================================
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import useAuth from './hooks/useAuth';
import Header from './components/Layout/Header';
import HomePage from './components/Home/HomePage';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import Dashboard from './components/Dashboard/Dashboard';
import UserProfile from './components/Profile/UserProfile';
import NoteUpload from './components/Notes/NoteUpload';
import NoteView from './components/Notes/NoteView'; // <-- IMPORT NEW COMPONENT
import FullPageSpinner from './components/Layout/FullPageSpinner';

function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <FullPageSpinner />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans transition-colors duration-300">
        <Header user={user} />
        <main>
          <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <HomePage />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <SignUp />} />
            
            <Route 
              path="/dashboard" 
              element={<ProtectedRoute user={user}><Dashboard /></ProtectedRoute>} 
            />
            <Route 
              path="/profile" 
              element={<ProtectedRoute user={user}><UserProfile /></ProtectedRoute>} 
            />
            <Route 
              path="/upload" 
              element={<ProtectedRoute user={user}><NoteUpload /></ProtectedRoute>} 
            />
            {/* V-- ADD NEW ROUTE FOR VIEWING A NOTE --V */}
            <Route 
              path="/note/:noteId" 
              element={<ProtectedRoute user={user}><NoteView /></ProtectedRoute>} 
            />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;