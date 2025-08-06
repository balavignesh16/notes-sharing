// frontend/src/components/Auth.js
import React, { useState, useEffect } from 'react';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

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

const Auth = ({ onAuthSuccess }) => {
    const [isRegistering, setIsRegistering] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [joiningYear, setJoiningYear] = useState('');
    const [regNumber, setRegNumber] = useState('');
    const [selectedDegree, setSelectedDegree] = useState('');
    const [selectedProgramme, setSelectedProgramme] = useState('');
    const [programmesForDegree, setProgrammesForDegree] = useState([]);
    const [collegeEmail, setCollegeEmail] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null); // NEW: State for success message

    useEffect(() => {
        const foundDegree = collegeCourses.find(course => course.degree === selectedDegree);
        if (foundDegree) {
            setProgrammesForDegree(foundDegree.programmes);
            if (!foundDegree.programmes.includes(selectedProgramme)) {
                setSelectedProgramme('');
            }
        } else {
            setProgrammesForDegree([]);
            setSelectedProgramme('');
        }
    }, [selectedDegree]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null); // Clear success message on new submission

        try {
            if (isRegistering) {
                if (!selectedDegree || !selectedProgramme) {
                    setError("Please select both Degree and Programme.");
                    return;
                }

                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await sendUserDataToBackend(userCredential.user.uid);
                
                // MODIFIED: Redirect to login on success
                setSuccessMessage("Registration successful! Please log in.");
                setIsRegistering(false);

            } else {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                onAuthSuccess(userCredential.user);
            }
        } catch (err) {
            setError(err.message);
            console.error("Auth error:", err);
        }
    };

    const sendUserDataToBackend = async (firebaseUid) => {
        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: firebaseUid,
                    name,
                    email,
                    joiningYear: parseInt(joiningYear),
                    regNumber,
                    degree: selectedDegree,
                    programme: selectedProgramme,
                    collegeEmail,
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to register user data on backend.');
            }
            console.log("User data sent to backend successfully!");
        } catch (err) {
            console.error("Error sending user data to backend:", err);
            setError("Backend registration failed: " + err.message);
            throw err;
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header text-center">
                            <h2>{isRegistering ? 'Register' : 'Login'}</h2>
                        </div>
                        <div className="card-body">
                            {error && <div className="alert alert-danger">{error}</div>}
                            {successMessage && <div className="alert alert-success">{successMessage}</div>} {/* NEW: Display success message */}
                            <form onSubmit={handleSubmit}>
                                {isRegistering && (
                                    <>
                                        <div className="mb-3">
                                            <label htmlFor="name" className="form-label">Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="joiningYear" className="form-label">Joining Year (e.g., 2023)</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="joiningYear"
                                                value={joiningYear}
                                                onChange={(e) => setJoiningYear(e.target.value)}
                                                min="2000"
                                                max="2025"
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="regNumber" className="form-label">Registration Number</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="regNumber"
                                                value={regNumber}
                                                onChange={(e) => setRegNumber(e.target.value)}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="degree" className="form-label">Degree</label>
                                            <select
                                                className="form-select"
                                                id="degree"
                                                value={selectedDegree}
                                                onChange={(e) => setSelectedDegree(e.target.value)}
                                                required
                                            >
                                                <option value="">Select Degree</option>
                                                {collegeCourses.map((course, index) => (
                                                    <option key={index} value={course.degree}>{course.degree}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="programme" className="form-label">Programme</label>
                                            <select
                                                className="form-select"
                                                id="programme"
                                                value={selectedProgramme}
                                                onChange={(e) => setSelectedProgramme(e.target.value)}
                                                disabled={!selectedDegree}
                                                required
                                            >
                                                <option value="">Select Programme</option>
                                                {programmesForDegree.map((p, index) => (
                                                    <option key={index} value={p}>{p}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="collegeEmail" className="form-label">College Email ID</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                id="collegeEmail"
                                                value={collegeEmail}
                                                onChange={(e) => setCollegeEmail(e.target.value)}
                                            />
                                        </div>
                                    </>
                                )}
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email address (for login)</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">
                                    {isRegistering ? 'Register' : 'Login'}
                                </button>
                            </form>
                            <p className="text-center mt-3">
                                {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
                                <button
                                    className="btn btn-link"
                                    onClick={() => {
                                        setIsRegistering(!isRegistering);
                                        setSuccessMessage(null);
                                        setError(null);
                                    }}
                                >
                                    {isRegistering ? 'Login' : 'Register'}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;