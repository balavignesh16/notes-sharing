// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import Auth from './components/Auth';
import UserProfile from './components/UserProfile';
import NoteUpload from './components/NoteUpload';
import 'bootstrap/dist/css/bootstrap.min.css';

const pages = {
    'profile': UserProfile,
    'upload': NoteUpload
};

function App() {
    const [user, setUser] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState('profile');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                try {
                    const response = await fetch(`http://localhost:5000/api/profile/${currentUser.uid}`);
                    if (response.ok) {
                        const data = await response.json();
                        setProfileData(data);
                    } else {
                        console.error('Failed to fetch profile data:', response.statusText);
                        setProfileData(null);
                    }
                } catch (error) {
                    console.error('Error fetching profile data:', error);
                    setProfileData(null);
                }
            } else {
                setProfileData(null);
                setCurrentPage('profile');
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

    const PageComponent = pages[currentPage];

    return (
        <div className="App">
            {user ? (
                <>
                    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
                        <div className="container-fluid">
                            <a className="navbar-brand" href="#profile" onClick={(e) => { e.preventDefault(); setCurrentPage('profile'); }}>Interactive Lecture Notes</a>
                            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarNav">
                                <ul className="navbar-nav me-auto">
                                    <li className="nav-item">
                                        <a className="nav-link" href="#profile" onClick={(e) => { e.preventDefault(); setCurrentPage('profile'); }}>Profile</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="#upload" onClick={(e) => { e.preventDefault(); setCurrentPage('upload'); }}>Upload Note</a>
                                    </li>
                                </ul>
                                <ul className="navbar-nav ms-auto">
                                    <li className="nav-item">
                                        <span className="navbar-text me-3">Welcome, {profileData ? profileData.name : user.email}</span>
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
                        {profileData ? (
                            <PageComponent user={user} profileData={profileData} />
                        ) : (
                            <div className="alert alert-warning text-center">
                                No profile data found. Please ensure you have completed registration.
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <Auth onAuthSuccess={handleAuthSuccess} />
            )}
        </div>
    );
}

export default App;