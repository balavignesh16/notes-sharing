import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';
import FullPageSpinner from '../Layout/FullPageSpinner';

export default function UserProfile() {
    const [userProfile, setUserProfile] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth.currentUser) {
            setError("No user is logged in.");
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            try {
                const user = auth.currentUser;
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const profileData = docSnap.data();
                    const currentDate = new Date(); 
                    const currentYear = currentDate.getFullYear();
                    const joiningYear = profileData.joiningYear;
                    let academicYear = currentYear - joiningYear;
                    if (currentDate.getMonth() >= 7) { 
                       academicYear += 1;
                    }
                    profileData.currentAcademicYear = academicYear;
                    setUserProfile(profileData);
                } else { 
                    setError("Could not find your user profile data."); 
                }
            } catch (err) { 
                console.error("Firebase Error: ", err);
                setError("Failed to fetch profile. Check console for details."); 
            } finally { 
                setLoading(false); 
            }
        };
        fetchProfile();
    }, []);

    if (loading) return <FullPageSpinner />;
    if (error) return <div className="max-w-4xl mx-auto text-center py-10 px-4 text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20 rounded-lg">{error}</div>;
    if (!userProfile) return <div className="text-center py-10 text-gray-500 dark:text-gray-400">No profile data available.</div>;

    return (
        <div className="py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                    <div className="bg-cover bg-center h-40" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80)'}}></div>
                    <div className="p-6">
                        <div className="sm:flex sm:items-center sm:justify-between">
                            <div className="sm:flex sm:space-x-5">
                                <div className="flex-shrink-0">
                                    <div className="mx-auto h-24 w-24 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-300 text-4xl font-bold">
                                        {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : '?'}
                                    </div>
                                </div>
                                <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                                    <p className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">{userProfile.name}</p>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{userProfile.programme}</p>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-0">
                                <span className="inline-flex items-center px-4 py-2 bg-indigo-100 dark:bg-indigo-500/30 text-indigo-800 dark:text-indigo-200 text-sm font-medium rounded-full">
                                    {userProfile.currentAcademicYear}{userProfile.currentAcademicYear === 1 ? 'st' : userProfile.currentAcademicYear === 2 ? 'nd' : userProfile.currentAcademicYear === 3 ? 'rd' : 'th'} Year
                                </span>
                            </div>
                        </div>
                        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Degree</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{userProfile.degree}</dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Registration No.</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{userProfile.registrationNumber}</dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Joining Year</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{userProfile.joiningYear}</dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{auth.currentUser.email}</dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">College Email</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{userProfile.collegeEmail}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
