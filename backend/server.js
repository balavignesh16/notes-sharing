// backend/server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const dbPath = path.resolve(__dirname, 'notes_platform.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // --- MODIFIED: Updated users table schema for degree and programme ---
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            joining_year INTEGER NOT NULL,
            reg_number TEXT,
            degree TEXT,       -- Changed from course
            programme TEXT,    -- New field
            college_email TEXT
        )`, (err) => {
            if (err) {
                console.error('Error creating users table:', err.message);
            } else {
                console.log('Users table checked/created.');
            }
        });
    }
});

// Endpoint for user registration
app.post('/api/register', (req, res) => {
    // --- MODIFIED: Destructuring degree and programme ---
    const { id, name, email, joiningYear, regNumber, degree, programme, collegeEmail } = req.body;

    if (!id || !name || !email || !joiningYear || !degree || !programme) { // Added degree and programme to validation
        return res.status(400).json({ message: 'Missing required fields: Firebase UID, name, email, joining year, degree, and programme are essential.' });
    }

    // --- MODIFIED: Updated INSERT statement for degree and programme ---
    const sql = `INSERT INTO users (id, name, email, joining_year, reg_number, degree, programme, college_email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    db.run(sql, [id, name, email, joiningYear, regNumber, degree, programme, collegeEmail], function(err) {
        if (err) {
            console.error('Error inserting new user into database:', err.message);
            if (err.message.includes('UNIQUE constraint failed: users.email')) {
                return res.status(409).json({ message: 'A user with this email already exists.' });
            }
            return res.status(500).json({ message: 'Failed to register user data in the database.' });
        }
        res.status(201).json({ message: 'User data registered successfully in database.', userId: id });
    });
});

// Endpoint to retrieve a user's profile data
app.get('/api/profile/:id', (req, res) => {
    const userId = req.params.id;

    // --- MODIFIED: Updated SELECT statement for degree and programme ---
    const sql = `SELECT id, name, email, joining_year, reg_number, degree, programme, college_email FROM users WHERE id = ?`;
    db.get(sql, [userId], (err, row) => {
        if (err) {
            console.error('Error retrieving user profile from database:', err.message);
            return res.status(500).json({ message: 'Error retrieving profile data.' });
        }
        if (!row) {
            return res.status(404).json({ message: 'User not found in database.' });
        }

        const currentYear = 2025;
        const academicYear = currentYear - row.joining_year + 1;

        // --- MODIFIED: Responding with degree and programme ---
        res.json({
            id: row.id,
            name: row.name,
            email: row.email,
            joiningYear: row.joining_year,
            registrationNumber: row.reg_number,
            degree: row.degree,     // Changed from course
            programme: row.programme, // New field
            collegeEmail: row.college_email,
            currentAcademicYear: academicYear
        });
    });
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});