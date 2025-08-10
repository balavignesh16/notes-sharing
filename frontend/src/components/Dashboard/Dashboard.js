import React, { useState, useEffect, useMemo } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Link } from 'react-router-dom';
import FullPageSpinner from '../Layout/FullPageSpinner';
import { useProfile } from '../../context/ProfileContext';

const CourseCard = ({ courseName }) => (
    <Link 
        to={`/course/${encodeURIComponent(courseName)}`} 
        className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl dark:hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-1"
    >
        <div className="h-24 bg-indigo-500 dark:bg-indigo-700 rounded-md mb-4"></div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">{courseName.split(' - ')[1]}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{courseName.split(' - ')[0]}</p>
    </Link>
);

export default function Dashboard() {
    const { profile } = useProfile();
    const [allAvailableCourses, setAllAvailableCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const notesSnapshot = await getDocs(collection(db, 'notes'));
                const courseSet = new Set();
                notesSnapshot.docs.forEach(doc => courseSet.add(doc.data().course));
                setAllAvailableCourses(Array.from(courseSet));
            } catch (err) {
                setError('Failed to fetch courses.');
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const { myCourses, discoverCourses } = useMemo(() => {
        const subscribed = new Set(profile?.subscribedCourses || []);
        const myCourses = allAvailableCourses.filter(course => subscribed.has(course));
        const discoverCourses = allAvailableCourses.filter(course => !subscribed.has(course));
        return { myCourses, discoverCourses };
    }, [profile, allAvailableCourses]);

    const filteredDiscoverCourses = useMemo(() => {
        if (!searchTerm) return discoverCourses;
        return discoverCourses.filter(course => 
            course.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, discoverCourses]);

    if (loading) return <FullPageSpinner />;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            {/* My Courses Section */}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">My Courses</h1>
            {myCourses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {myCourses.map(courseName => <CourseCard key={courseName} courseName={courseName} />)}
                </div>
            ) : (
                <div className="text-center py-10 px-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <p className="text-gray-500 dark:text-gray-400">You haven't subscribed to any courses with available notes yet. Go to your profile to add some!</p>
                </div>
            )}

            {/* Discover Courses Section */}
            <div className="mt-12">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Discover Courses</h1>
                    <input 
                        type="text"
                        placeholder="Search all courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full max-w-xs px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md text-gray-900 dark:text-white"
                    />
                </div>
                {filteredDiscoverCourses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredDiscoverCourses.map(courseName => <CourseCard key={courseName} courseName={courseName} />)}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-10">No other courses found.</p>
                )}
            </div>
        </div>
    );
}
