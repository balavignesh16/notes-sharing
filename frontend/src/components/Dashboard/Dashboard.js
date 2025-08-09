import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Link } from 'react-router-dom';
import FullPageSpinner from '../Layout/FullPageSpinner';

const Icon = ({ path, className = "w-4 h-4 mr-1.5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);

const NoteCard = ({ note }) => (
    <Link to={`/note/${note.id}`} className="block p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl dark:hover:bg-gray-700 transition-shadow duration-300">
        <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 truncate">{note.topic}</h3>
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{note.course}</p>
        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <p className="flex items-center"><Icon path="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /> {note.faculty}</p>
            <p className="flex items-center"><Icon path="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /> Module {note.module}</p>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
            {note.tags?.slice(0, 3).map(tag => (
                <span key={tag} className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-full">{tag}</span>
            ))}
        </div>
    </Link>
);

export default function Dashboard() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const notesCollection = collection(db, 'notes');
                const notesSnapshot = await getDocs(notesCollection);
                const notesList = notesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setNotes(notesList);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch notes.');
            } finally {
                setLoading(false);
            }
        };

        fetchNotes();
    }, []);

    if (loading) {
        return <FullPageSpinner />;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Notes Dashboard</h1>
            {notes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {notes.map(note => (
                        <NoteCard key={note.id} note={note} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 px-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">No notes found!</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Why not be the first to upload one?</p>
                    <Link to="/upload" className="mt-4 inline-block bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700 transition-colors">
                        Upload a Note
                    </Link>
                </div>
            )}
        </div>
    );
}
