import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';

const collegeCourses = [
    { degree: "B.Tech", programmes: ["Civil Engineering", "Computer Science and Engineering", "Computer Science and Engineering (Artificial Intelligence and Machine Learning)", "Computer Science and Engineering (Artificial Intelligence and Robotics)", "Computer Science and Engineering (Cyber Physical Systems)", "Computer Science and Engineering (Cyber Security)", "Computer Science and Engineering (Data Science)", "Electrical and Computer Science Engineering", "Electrical and Electronics Engineering", "Electronics and Communication Engineering", "Electronics and Computer Engineering", "Electronics Engineering (VLSI Design and Technology)", "Fashion Technology", "Mechanical Engineering", "Mechanical Engineering with Specialization in Electric Vehicles", "Mechatronics and Automation"]},
    { degree: "B.A.,LLB.(Hons)", programmes: ["B.A., LL.B (Hons.)"] },
    { degree: "B.B.A.,LLB (Hons.)", programmes: ["B.B.A., LL.B (Hons.)"] },
    { degree: "BBA (Hons.)", programmes: ["B.B.A (Hons.)"] },
    { degree: "B.Com (Hons.)", programmes: ["B.Com. (Hons.)"] },
    { degree: "B.Sc", programmes: ["Fashion Design", "Computer Science", "Economics (Hons.)"] },
    { degree: "Integrated M.Sc.", programmes: ["Applied Psychology"] },
    { degree: "Integrated M.Tech.", programmes: ["Computer Science and Engineering (Business Analytics)", "Computer Science and Engineering (Software Engineering)"] },
    { degree: "M.Tech.", programmes: ["CAD/CAM", "Computer Science and Engineering", "Computer Science and Engineering (Artificial Intelligence & Machine Learning)", "Computer Science and Engineering (Big data Analytics)", "Electric Mobility", "Embedded Systems", "Mechatronics", "Structural Engineering", "VLSI Design"]},
    { degree: "M.B.A", programmes: ["Master of Business Administration"] },
    { degree: "M.C.A", programmes: ["Master of Computer Applications"] },
    { degree: "M.Sc.", programmes: ["Chemistry", "Data Science", "Physics"] },
    { degree: "LL.M.", programmes: ["Corporate Law", "Intellectual Property Law", "International Law & Development"] },
    { degree: "Ph.D", programmes: ["Research"] }
];

const inputClass = "appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm";

export default function SignUp() {
    // ... (logic remains the same)
    const [formData, setFormData] = useState({ name: '', email: '', password: '', joiningYear: '', registrationNumber: '', degree: '', programme: '', collegeEmail: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const availableProgrammes = useMemo(() => {
        if (!formData.degree) return [];
        const selectedDegree = collegeCourses.find(course => course.degree === formData.degree);
        return selectedDegree ? selectedDegree.programmes : [];
    }, [formData.degree]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newState = { ...prev, [name]: value };
            if (name === 'degree') { newState.programme = ''; }
            return newState;
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password.length < 6) { setError("Password must be at least 6 characters long."); return; }
        if (!formData.degree || !formData.programme) { setError("Please select your degree and programme."); return; }
        setError('');
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;
            const { password, ...userDataForDb } = formData;
            await setDoc(doc(db, "users", user.uid), {
                ...userDataForDb,
                joiningYear: Number(formData.joiningYear),
                points: 0,
                streak: 0,
                createdAt: new Date().toISOString()
            });
            navigate('/dashboard');
        } catch (error) {
            setError(error.message.replace('Firebase: ', ''));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <div><h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">Create your account</h2></div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <input name="name" placeholder="Full Name" onChange={handleChange} className={inputClass} required />
                    <input name="email" type="email" placeholder="Email" onChange={handleChange} className={inputClass} required />
                    <input name="password" type="password" placeholder="Password" onChange={handleChange} className={inputClass} required />
                    <input name="joiningYear" type="number" placeholder="Joining Year" onChange={handleChange} className={inputClass} required />
                    <input name="registrationNumber" placeholder="Registration Number" onChange={handleChange} className={inputClass} required />
                    <select name="degree" value={formData.degree} onChange={handleChange} className={inputClass} required>
                        <option value="" disabled>Select a Degree</option>
                        {collegeCourses.map(course => <option key={course.degree} value={course.degree}>{course.degree}</option>)}
                    </select>
                    <select name="programme" value={formData.programme} onChange={handleChange} className={inputClass} required disabled={!formData.degree}>
                        <option value="" disabled>Select a Programme</option>
                        {availableProgrammes.map(prog => <option key={prog} value={prog}>{prog}</option>)}
                    </select>
                    <input name="collegeEmail" type="email" placeholder="College Email" onChange={handleChange} className={inputClass} required />
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400">
                        {loading ? 'Creating account...' : 'Sign Up'}
                    </button>
                </form>
            </div>
        </div>
    );
}
