// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { auth } from './firebaseConfig'; // Import Firebase auth instance
import { onAuthStateChanged } from 'firebase/auth'; // Firebase function to listen for auth state changes
import Auth from './components/Auth'; // CORRECTED: Use './components/Auth'
import UserProfile from './components/UserProfile'; // CORRECTED: Use './components/UserProfile'
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS for responsive UI

function App() {
    const [user, setUser] = useState(null); // State to hold the currently logged-in Firebase user
    const [loading, setLoading] = useState(true); // State to manage initial loading of authentication status

    useEffect(() => {
        // Subscribe to Firebase authentication state changes
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser); // Update user state with the current user (or null if logged out)
            setLoading(false); // Set loading to false once auth state is determined
        });
        return () => unsubscribe(); // Cleanup the subscription when the component unmounts
    }, []);

    // Callback function to handle successful authentication (login or registration)
    const handleAuthSuccess = (loggedInUser) => {
        setUser(loggedInUser); // Update the user state
    };

    if (loading) {
        // Display a loading message while checking authentication status
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
            {user ? ( // Conditionally render based on whether a user is logged in
                <>
                    {/* Navigation Bar for logged-in users */}
                    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
                        <div className="container-fluid">
                            <a className="navbar-brand" href="/">Interactive Lecture Notes</a>
                            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarNav">
                                <ul className="navbar-nav ms-auto">
                                    <li className="nav-item">
                                        <span className="navbar-text me-3">Welcome, {user.email}</span>
                                    </li>
                                    <li className="nav-item">
                                        {/* Logout button */}
                                        <button className="btn btn-outline-danger" onClick={() => auth.signOut()}>
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                    {/* Main content area for authenticated users */}
                    <div className="container mt-4">
                        <UserProfile user={user} /> {/* Pass the authenticated user to UserProfile component */}
                        {/* Other authenticated components (e.g., note upload, search) will go here in future sprints */}
                    </div>
                </>
            ) : (
                // Render the Auth component if no user is logged in
                <Auth onAuthSuccess={handleAuthSuccess} />
            )}
        </div>
    );
}

export default App;