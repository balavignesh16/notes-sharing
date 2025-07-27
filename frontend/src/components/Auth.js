// frontend/src/components/Auth.js
import React, { useState } from 'react';
import { auth } from '../firebaseConfig'; // Import Firebase auth instance [cite: 121]
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'; // Firebase authentication functions [cite: 121]

const Auth = ({ onAuthSuccess }) => {
    const [isRegistering, setIsRegistering] = useState(true); // State to toggle between register and login forms
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [joiningYear, setJoiningYear] = useState(''); // [cite: 122]
    const [regNumber, setRegNumber] = useState(''); // [cite: 122]
    const [course, setCourse] = useState(''); // [cite: 122]
    const [collegeEmail, setCollegeEmail] = useState(''); // [cite: 122]
    const [error, setError] = useState(null); // State for displaying error messages

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        setError(null); // Clear previous errors

        try {
            let userCredential;
            if (isRegistering) {
                // Attempt to create a user with Email and Password using Firebase
                userCredential = await createUserWithEmailAndPassword(auth, email, password); // [cite: 121]
                // If Firebase registration is successful, send additional user data to your backend
                await sendUserDataToBackend(userCredential.user.uid); // [cite: 122]
            } else {
                // Attempt to sign in a user with Email and Password using Firebase
                userCredential = await signInWithEmailAndPassword(auth, email, password); // [cite: 121]
            }
            // Call the success callback function with the authenticated user object
            onAuthSuccess(userCredential.user);
        } catch (err) {
            // Catch and display any errors during authentication
            setError(err.message);
            console.error("Authentication error:", err);
        }
    };

    // Function to send user's profile data to your Node.js backend
    const sendUserDataToBackend = async (firebaseUid) => {
        try {
            const response = await fetch('http://localhost:5000/api/register', { // [cite: 124]
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: firebaseUid, // Firebase UID will be the primary key in your SQLite DB [cite: 101]
                    name,
                    email,
                    joiningYear: parseInt(joiningYear), // Convert to number [cite: 122]
                    regNumber, // [cite: 122]
                    course, // [cite: 122]
                    collegeEmail, // [cite: 122]
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to register user data on backend.');
            }
            console.log("User data sent to backend successfully!");
        } catch (err) {
            console.error("Error sending user data to backend:", err);
            // Set an error for the user to see, and potentially offer a retry or explain
            setError("Backend registration failed: " + err.message + ". Please try again or contact support.");
            // In a production app, you might consider rolling back the Firebase account creation here
            // if the backend registration fails, to keep data consistent.
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header text-center">
                            <h2>{isRegistering ? 'Register' : 'Login'}</h2>
                        </div>
                        <div className="card-body">
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleSubmit}>
                                {isRegistering && ( // Render extra fields only for registration [cite: 122]
                                    <>
                                        <div className="mb-3">
                                            <label htmlFor="name" className="form-label">Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="joiningYear" className="form-label">Joining Year (e.g., 2023)</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="joiningYear"
                                                value={joiningYear}
                                                onChange={(e) => setJoiningYear(e.target.value)}
                                                min="2000" // Sensible minimum year
                                                max="2025" // Current year [cite: 71]
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="regNumber" className="form-label">Registration Number</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="regNumber"
                                                value={regNumber}
                                                onChange={(e) => setRegNumber(e.target.value)}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="course" className="form-label">Course (e.g., Computer Science)</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="course"
                                                value={course}
                                                onChange={(e) => setCourse(e.target.value)}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="collegeEmail" className="form-label">College Email ID</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                id="collegeEmail"
                                                value={collegeEmail}
                                                onChange={(e) => setCollegeEmail(e.target.value)}
                                            />
                                        </div>
                                    </>
                                )}
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email address (for login)</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">
                                    {isRegistering ? 'Register' : 'Login'}
                                </button>
                            </form>
                            <p className="text-center mt-3">
                                {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
                                <button
                                    className="btn btn-link"
                                    onClick={() => setIsRegistering(!isRegistering)}
                                >
                                    {isRegistering ? 'Login' : 'Register'}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;