import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../../services/firebase';
import allCourses from '../../courseData'; // Import the course data

const uploadInputClass = "appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm";

export default function NoteUpload() {
    const [noteData, setNoteData] = useState({ course: '', faculty: '', module: '', topic: '', tags: '' });
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleDataChange = (e) => setNoteData({ ...noteData, [e.target.name]: e.target.value });
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === "application/pdf") {
            setFile(selectedFile);
            setError('');
        } else {
            setFile(null);
            setError('Please select a valid PDF file.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) { setError('Please select a file to upload.'); return; }
        if (!noteData.course) { setError('Please select a course.'); return; }
        setError(''); setMessage(''); setLoading(true); setUploadProgress(0);
        try {
            const user = auth.currentUser;
            if (!user) throw new Error("You must be logged in to upload notes.");
            const storageRef = ref(storage, `notes/${user.uid}/${Date.now()}_${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on('state_changed', 
                (snapshot) => setUploadProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
                (error) => { throw error; }, 
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    await addDoc(collection(db, "notes"), {
                        userId: user.uid, ...noteData, module: Number(noteData.module),
                        tags: noteData.tags.split(',').map(tag => tag.trim()),
                        fileUrl: downloadURL, ocrText: "", createdAt: new Date().toISOString(),
                    });
                    setMessage('Note uploaded successfully!');
                    setNoteData({ course: '', faculty: '', module: '', topic: '', tags: '' });
                    setFile(null); e.target.reset(); setLoading(false);
                }
            );
        } catch (err) { setError(err.message.replace('Firebase: ', '')); setLoading(false); }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <div><h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">Upload a New Note</h2></div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                     <select 
                        name="course" 
                        value={noteData.course} 
                        onChange={handleDataChange} 
                        className={uploadInputClass} 
                        required
                     >
                        <option value="" disabled>Select a Course</option>
                        {allCourses.map(course => (
                            <option key={course.courseCode} value={`${course.courseCode} - ${course.courseTitle}`}>
                                {course.courseCode} - {course.courseTitle}
                            </option>
                        ))}
                     </select>
                     <input name="faculty" placeholder="Faculty Name" value={noteData.faculty} onChange={handleDataChange} className={uploadInputClass} required />
                     <input name="module" type="number" placeholder="Module Number" value={noteData.module} onChange={handleDataChange} className={uploadInputClass} required />
                     <input name="topic" placeholder="Topic" value={noteData.topic} onChange={handleDataChange} className={uploadInputClass} required />
                     <input name="tags" placeholder="Tags (comma-separated)" value={noteData.tags} onChange={handleDataChange} className={uploadInputClass} />
                     <input type="file" accept=".pdf" onChange={handleFileChange} className={`${uploadInputClass} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 dark:file:bg-indigo-900/50 file:text-indigo-700 dark:file:text-indigo-300 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-800/50`} required />
                    {loading && (
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                    )}
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    {message && <p className="text-green-500 text-sm text-center">{message}</p>}
                    <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400">
                        {loading ? `Uploading ${Math.round(uploadProgress)}%` : 'Upload Note'}
                    </button>
                </form>
            </div>
        </div>
    );
}
