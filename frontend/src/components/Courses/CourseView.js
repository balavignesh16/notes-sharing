import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import FullPageSpinner from '../Layout/FullPageSpinner';

const ModuleAccordion = ({ moduleNumber, notes }) => {
    const [isOpen, setIsOpen] = useState(true); // Default to open

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-4">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 text-left font-semibold text-lg text-gray-800 dark:text-gray-200"
            >
                <span>Module {moduleNumber}</span>
                <svg className={`w-6 h-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                    <div className="space-y-3">
                        {notes.map(note => (
                            <Link 
                                to={`/note/${note.id}`} 
                                key={note.id}
                                className="block p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600"
                            >
                                <p className="font-semibold text-indigo-600 dark:text-indigo-400">{note.topic}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">by {note.faculty}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default function CourseView() {
    const { courseName } = useParams();
    const decodedCourseName = decodeURIComponent(courseName);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const q = query(collection(db, 'notes'), where('course', '==', decodedCourseName));
                const querySnapshot = await getDocs(q);
                const notesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setNotes(notesList);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch notes for this course.');
            } finally {
                setLoading(false);
            }
        };
        fetchNotes();
    }, [decodedCourseName]);

    const modules = useMemo(() => {
        return notes.reduce((acc, note) => {
            const moduleNum = note.module || 'Uncategorized';
            if (!acc[moduleNum]) {
                acc[moduleNum] = [];
            }
            acc[moduleNum].push(note);
            return acc;
        }, {});
    }, [notes]);

    if (loading) return <FullPageSpinner />;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{decodedCourseName.split(' - ')[1]}</h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-6">{decodedCourseName.split(' - ')[0]}</p>

            {Object.keys(modules).length > 0 ? (
                Object.keys(modules).sort((a, b) => a - b).map(moduleNumber => (
                    <ModuleAccordion 
                        key={moduleNumber}
                        moduleNumber={moduleNumber}
                        notes={modules[moduleNumber]}
                    />
                ))
            ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-10">No notes have been uploaded for this course yet.</p>
            )}
        </div>
    );
}
