// frontend/src/components/UserProfile.js
import React, { useState, useEffect } from 'react';

const UserProfile = ({ user }) => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user || !user.uid) {
                setError("User not logged in or UID not available.");
                setLoading(false);
                return;
            }
            try {
                const response = await fetch(`http://localhost:5000/api/profile/${user.uid}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch profile from backend.');
                }
                const data = await response.json();
                setProfileData(data);
            } catch (err) {
                setError(err.message);
                console.error("Error fetching profile:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    if (loading) {
        return <div className="text-center mt-5">Loading profile...</div>;
    }

    if (error) {
        return <div className="alert alert-danger mt-5">Error loading profile: {error}</div>;
    }

    if (!profileData) {
        return <div className="text-center mt-5">No profile data available. Please complete registration.</div>;
    }

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
                    {/* --- MODIFIED: Display Degree and Programme --- */}
                    <div className="row mb-2">
                        <div className="col-md-6"><strong>Degree:</strong></div>
                        <div className="col-md-6">{profileData.degree || 'N/A'}</div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-md-6"><strong>Programme:</strong></div>
                        <div className="col-md-6">{profileData.programme || 'N/A'}</div>
                    </div>
                    {/* --- END MODIFIED --- */}
                    <div className="row mb-2">
                        <div className="col-md-6"><strong>College Email ID:</strong></div>
                        <div className="col-md-6">{profileData.collegeEmail || 'N/A'}</div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-md-6"><strong>Current Academic Year:</strong></div>
                        <div className="col-md-6">
                            {profileData.currentAcademicYear}
                            <sup>{
                                profileData.currentAcademicYear === 1 ? 'st' :
                                profileData.currentAcademicYear === 2 ? 'nd' :
                                profileData.currentAcademicYear === 3 ? 'rd' : 'th'
                            }</sup> year
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;