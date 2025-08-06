// frontend/src/components/NoteUpload.js
import React, { useState } from 'react';
import allCourses from '../courseData';

const NoteUpload = ({ user, profileData }) => {
    const [faculty, setFaculty] = useState('');
    const [courseTitle, setCourseTitle] = useState('');
    const [courseCode, setCourseCode] = useState('');
    const [module, setModule] = useState('');
    const [topic, setTopic] = useState('');
    const [tags, setTags] = useState('');
    const [pdfFile, setPdfFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size > 10 * 1024 * 1024) {
            setError("File size exceeds 10MB limit.");
            setPdfFile(null);
        } else {
            setPdfFile(file);
            setError("");
        }
    };

    const handleCourseTitleSelect = (e) => {
        const title = e.target.value;
        setCourseTitle(title);
        const selectedCourse = allCourses.find(c => c.courseTitle === title);
        if (selectedCourse) {
            setCourseCode(selectedCourse.courseCode);
        } else {
            setCourseCode('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user.uid || !courseTitle || !courseCode || !module || !pdfFile) {
            setError("Please fill all required fields and select a PDF file.");
            return;
        }

        const formData = new FormData();
        formData.append('userId', user.uid);
        formData.append('degree', profileData.degree);
        formData.append('programme', profileData.programme);
        formData.append('faculty', faculty);
        formData.append('courseTitle', courseTitle);
        formData.append('courseCode', courseCode);
        formData.append('module', module);
        formData.append('topic', topic);
        formData.append('tags', tags);
        formData.append('pdfFile', pdfFile);

        setLoading(true);
        setUploadStatus('Uploading note...');
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/notes/upload', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Something went wrong during upload.');
            }
            setUploadStatus(result.message);
            // Reset form fields
            setFaculty('');
            setCourseTitle('');
            setCourseCode('');
            setModule('');
            setTopic('');
            setTags('');
            setPdfFile(null);
        } catch (err) {
            console.error('Upload error:', err);
            setError(err.message);
            setUploadStatus('Upload failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="card shadow-sm">
                <div className="card-header bg-primary text-white text-center">
                    <h3>Upload Lecture Notes</h3>
                </div>
                <div className="card-body">
                    {error && <div className="alert alert-danger">{error}</div>}
                    {uploadStatus && <div className="alert alert-success">{uploadStatus}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="degree" className="form-label">Degree</label>
                            <input type="text" className="form-control" id="degree" value={profileData?.degree || ''} disabled />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="programme" className="form-label">Programme</label>
                            <input type="text" className="form-control" id="programme" value={profileData?.programme || ''} disabled />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="faculty" className="form-label">Faculty Name</label>
                            <input type="text" className="form-control" id="faculty" value={faculty} onChange={(e) => setFaculty(e.target.value)} required />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="courseTitle" className="form-label">Course Title</label>
                            <input
                                type="text"
                                className="form-control"
                                id="courseTitle"
                                value={courseTitle}
                                onChange={handleCourseTitleSelect}
                                list="courseTitlesList"
                                required
                            />
                            <datalist id="courseTitlesList">
                                {allCourses.map((course, index) => (
                                    <option key={index} value={course.courseTitle} />
                                ))}
                            </datalist>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="courseCode" className="form-label">Course Code</label>
                            <input type="text" className="form-control" id="courseCode" value={courseCode} disabled />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="module" className="form-label">Module Number</label>
                            <input type="text" className="form-control" id="module" value={module} onChange={(e) => setModule(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="topic" className="form-label">Topic</label>
                            <input type="text" className="form-control" id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="tags" className="form-label">Manual Tags (comma-separated)</label>
                            <input type="text" className="form-control" id="tags" value={tags} onChange={(e) => setTags(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="pdfFile" className="form-label">Upload PDF (max 10MB)</label>
                            <input type="file" className="form-control" id="pdfFile" accept=".pdf" onChange={handleFileChange} required />
                        </div>

                        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                            {loading ? 'Uploading...' : 'Upload Note'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NoteUpload;