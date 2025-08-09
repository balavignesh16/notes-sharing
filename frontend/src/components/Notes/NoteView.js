import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Document, Page, pdfjs } from 'react-pdf';
import FullPageSpinner from '../Layout/FullPageSpinner';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Setup worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const Icon = ({ path, className = "w-5 h-5 mr-2" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);

export default function NoteView() {
    const { noteId } = useParams();
    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [numPages, setNumPages] = useState(null);

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const docRef = doc(db, 'notes', noteId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setNote(docSnap.data());
                } else {
                    setError('Note not found.');
                }
            } catch (err) {
                console.error(err);
                setError('Failed to fetch the note.');
            } finally {
                setLoading(false);
            }
        };

        fetchNote();
    }, [noteId]);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    if (loading) return <FullPageSpinner />;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* PDF Viewer */}
                <div className="lg:col-span-2 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-inner">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Note Preview</h2>
                    <div className="pdf-container overflow-y-auto max-h-[80vh]">
                        <Document
                            file={note.fileUrl}
                            onLoadSuccess={onDocumentLoadSuccess}
                            loading={<div className="text-center p-4 dark:text-gray-300">Loading PDF...</div>}
                            error={<div className="text-center p-4 text-red-500">Failed to load PDF. The file may be corrupt or the URL is incorrect.</div>}
                        >
                            {Array.from(new Array(numPages), (el, index) => (
                                <Page 
                                    key={`page_${index + 1}`} 
                                    pageNumber={index + 1} 
                                    renderTextLayer={true}
                                    renderAnnotationLayer={true}
                                />
                            ))}
                        </Document>
                    </div>
                </div>

                {/* Note Details & Comments */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{note.topic}</h1>
                        <p className="text-md text-indigo-600 dark:text-indigo-400 mt-1">{note.course}</p>
                        
                        <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                            <p className="flex items-center"><Icon path="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /> <strong>Faculty:</strong> &nbsp;{note.faculty}</p>
                            <p className="flex items-center"><Icon path="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /> <strong>Module:</strong> &nbsp;{note.module}</p>
                        </div>

                        <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                             <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Tags</h3>
                             <div className="mt-2 flex flex-wrap gap-2">
                                {note.tags?.map(tag => (
                                    <span key={tag} className="px-3 py-1 text-sm bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 rounded-full">{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Comments Section Placeholder */}
                    <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Comments</h2>
                        <div className="mt-4 text-center text-gray-500 dark:text-gray-400">
                            <p>Comments will be available soon!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
