// frontend/src/components/UserProfile.js
import React from 'react';

const UserProfile = ({ profileData }) => {

    if (!profileData) {
        return <div className="text-center mt-5">Loading profile data...</div>;
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
                    <div className="row mb-2">
                        <div className="col-md-6"><strong>Degree:</strong></div>
                        <div className="col-md-6">{profileData.degree || 'N/A'}</div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-md-6"><strong>Programme:</strong></div>
                        <div className="col-md-6">{profileData.programme || 'N/A'}</div>
                    </div>
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