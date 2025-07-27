// backend/server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Enable CORS for frontend-backend communication
app.use(express.json()); // Enable JSON body parsing for incoming requests

// Define the path to your SQLite database file
// The database file will be created in the 'backend' directory
const dbPath = path.resolve(__dirname, 'notes_platform.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // Create the 'users' table if it does not exist
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY, -- Stores Firebase User UID
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            joining_year INTEGER NOT NULL,
            reg_number TEXT,
            course TEXT,
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

// Endpoint for user registration (after successful Firebase authentication)
// This endpoint stores additional user profile data in the SQLite database
app.post('/api/register', (req, res) => {
    const { id, name, email, joiningYear, regNumber, course, collegeEmail } = req.body;

    // Basic validation for required fields
    if (!id || !name || !email || !joiningYear) {
        return res.status(400).json({ message: 'Missing required fields: Firebase UID, name, email, and joining year are essential.' });
    }

    // SQL query to insert a new user into the 'users' table
    const sql = `INSERT INTO users (id, name, email, joining_year, reg_number, course, college_email) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.run(sql, [id, name, email, joiningYear, regNumber, course, collegeEmail], function(err) {
        if (err) {
            console.error('Error inserting new user into database:', err.message);
            // Handle unique constraint violation (e.g., if email already exists)
            if (err.message.includes('UNIQUE constraint failed: users.email')) {
                return res.status(409).json({ message: 'A user with this email already exists.' });
            }
            return res.status(500).json({ message: 'Failed to register user data in the database.' });
        }
        // Respond with success message and the ID of the newly inserted row
        res.status(201).json({ message: 'User data registered successfully in database.', userId: id });
    });
});

// Endpoint to retrieve a user's profile data from the SQLite database
// The user ID (Firebase UID) is passed as a URL parameter
app.get('/api/profile/:id', (req, res) => {
    const userId = req.params.id; // Extract user ID from the URL

    // SQL query to select user data
    const sql = `SELECT id, name, email, joining_year, reg_number, course, college_email FROM users WHERE id = ?`;
    db.get(sql, [userId], (err, row) => {
        if (err) {
            console.error('Error retrieving user profile from database:', err.message);
            return res.status(500).json({ message: 'Error retrieving profile data.' });
        }
        if (!row) {
            // If no row is found, the user ID does not exist in our database
            return res.status(404).json({ message: 'User not found in database.' });
        }

        // Calculate the current academic year based on the joining year
        // As per problem statement, current date is July 27, 2025.
        const currentYear = 2025;
        const academicYear = currentYear - row.joining_year + 1;

        // Respond with the retrieved profile data and the calculated academic year
        res.json({
            id: row.id,
            name: row.name,
            email: row.email,
            joiningYear: row.joining_year,
            registrationNumber: row.reg_number,
            course: row.course,
            collegeEmail: row.college_email,
            currentAcademicYear: academicYear // This is the dynamically calculated value
        });
    });
});

// Start the backend server
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});