// frontend/src/components/UserProfile.js
import React, { useState, useEffect } from 'react';

const UserProfile = ({ user }) => { // Receives the Firebase user object as prop [cite: 128]
    const [profileData, setProfileData] = useState(null); // State to store fetched profile data
    const [loading, setLoading] = useState(true); // State to manage loading status
    const [error, setError] = useState(null); // State for error messages

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user || !user.uid) { // Ensure user object and UID are available
                setError("User not logged in or UID not available.");
                setLoading(false);
                return;
            }
            try {
                // Fetch user profile data from your backend API [cite: 129]
                const response = await fetch(`http://localhost:5000/api/profile/${user.uid}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch profile from backend.');
                }
                const data = await response.json();
                setProfileData(data); // Set the fetched data to state
            } catch (err) {
                setError(err.message); // Set error message
                console.error("Error fetching profile:", err);
            } finally {
                setLoading(false); // Set loading to false regardless of success or error
            }
        };

        fetchProfile(); // Call the fetch function when component mounts or user changes
    }, [user]); // Dependency array: re-run effect if 'user' object changes

    if (loading) {
        return <div className="text-center mt-5">Loading profile...</div>;
    }

    if (error) {
        return <div className="alert alert-danger mt-5">Error loading profile: {error}</div>;
    }

    if (!profileData) {
        return <div className="text-center mt-5">No profile data available. Please complete registration.</div>;
    }

    // Render the user's profile details [cite: 123]
    return (
        <div className="container mt-5">
            <div className="card shadow-sm">
                <div className="card-header bg-primary text-white text-center">
                    <h3>Your Profile</h3>
                </div>
                <div className="card-body">
                    <div className="row mb-2">
                        <div className="col-md-6"><strong>Name:</strong></div>
                        <div className="col-md-6">{profileData.name}</div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-md-6"><strong>Email:</strong></div>
                        <div className="col-md-6">{profileData.email}</div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-md-6"><strong>Joining Year:</strong></div>
                        <div className="col-md-6">{profileData.joiningYear}</div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-md-6"><strong>Registration Number:</strong></div>
                        <div className="col-md-6">{profileData.registrationNumber || 'N/A'}</div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-md-6"><strong>Course:</strong></div>
                        <div className="col-md-6">{profileData.course || 'N/A'}</div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-md-6"><strong>College Email ID:</strong></div>
                        <div className="col-md-6">{profileData.collegeEmail || 'N/A'}</div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-md-6"><strong>Current Academic Year:</strong></div>
                        <div className="col-md-6">
                            {profileData.currentAcademicYear}
                            <sup>{ // Add ordinal suffix (st, nd, rd, th)
                                profileData.currentAcademicYear === 1 ? 'st' :
                                profileData.currentAcademicYear === 2 ? 'nd' :
                                profileData.currentAcademicYear === 3 ? 'rd' : 'th'
                            }</sup> year
                            {/* Verify academic year calculation in testing  */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;