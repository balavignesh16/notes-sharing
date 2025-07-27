// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import Auth from './components/Auth';
import UserProfile from './components/UserProfile';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [user, setUser] = useState(null); // Firebase user object
    const [profileName, setProfileName] = useState('Guest'); // State to hold the user's name for the navbar
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                // If a user is logged in, fetch their name from the backend
                try {
                    const response = await fetch(`http://localhost:5000/api/profile/${currentUser.uid}`);
                    if (response.ok) {
                        const data = await response.json();
                        setProfileName(data.name || 'User'); // Set the name, default to 'User' if not found
                    } else {
                        console.error('Failed to fetch profile name:', response.statusText);
                        setProfileName(currentUser.email); // Fallback to email if name fetch fails
                    }
                } catch (error) {
                    console.error('Error fetching profile name:', error);
                    setProfileName(currentUser.email); // Fallback to email on error
                }
            } else {
                setProfileName('Guest'); // Reset to Guest if logged out
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleAuthSuccess = (loggedInUser) => {
        setUser(loggedInUser);
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="ms-2">Loading authentication status...</p>
            </div>
        );
    }

    return (
        <div className="App">
            {user ? (
                <>
                    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
                        <div className="container-fluid">
                            <a className="navbar-brand" href="/">Interactive Lecture Notes</a>
                            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarNav">
                                <ul className="navbar-nav ms-auto">
                                    <li className="nav-item">
                                        {/* MODIFIED: Display profileName */}
                                        <span className="navbar-text me-3">Welcome, {profileName}</span>
                                    </li>
                                    <li className="nav-item">
                                        <button className="btn btn-outline-danger" onClick={() => auth.signOut()}>
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                    <div className="container mt-4">
                        <UserProfile user={user} />
                    </div>
                </>
            ) : (
                <Auth onAuthSuccess={handleAuthSuccess} />
            )}
        </div>
    );
}

export default App;