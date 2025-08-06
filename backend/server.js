// backend/server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const natural = require('natural');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

const dbPath = path.resolve(__dirname, 'notes_platform.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');

        db.run(`CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            joining_year INTEGER NOT NULL,
            reg_number TEXT,
            degree TEXT,
            programme TEXT,
            college_email TEXT
        )`, (err) => {
            if (err) {
                console.error('Error creating users table:', err.message);
            } else {
                console.log('Users table checked/created.');
            }
        });

        // --- UPDATED: notes table schema - removed ocr_text ---
        db.run(`CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            degree TEXT NOT NULL,
            programme TEXT NOT NULL,
            faculty TEXT NOT NULL,
            course_title TEXT NOT NULL,
            course_code TEXT NOT NULL,
            module TEXT NOT NULL,
            topic TEXT,
            tags TEXT,
            file_url TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`, (err) => {
            if (err) {
                console.error('Error creating notes table:', err.message);
            } else {
                console.log('Notes table checked/created.');
            }
        });
    }
});

// Endpoint to handle profile registration (from Sprint 1)
app.post('/api/register', (req, res) => {
    const { id, name, email, joiningYear, regNumber, degree, programme, collegeEmail } = req.body;
    if (!id || !name || !email || !joiningYear || !degree || !programme) {
        return res.status(400).json({ message: 'Missing required fields for registration.' });
    }
    const sql = `INSERT INTO users (id, name, email, joining_year, reg_number, degree, programme, college_email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    db.run(sql, [id, name, email, joiningYear, regNumber, degree, programme, collegeEmail], function(err) {
        if (err) {
            console.error('Error inserting new user:', err.message);
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(409).json({ message: 'A user with this email already exists.' });
            }
            return res.status(500).json({ message: 'Failed to register user data.' });
        }
        res.status(201).json({ message: 'User data registered successfully.', userId: id });
    });
});

// Endpoint to retrieve profile data (from Sprint 1)
app.get('/api/profile/:id', (req, res) => {
    const userId = req.params.id;
    const sql = `SELECT id, name, email, joining_year, reg_number, degree, programme, college_email FROM users WHERE id = ?`;
    db.get(sql, [userId], (err, row) => {
        if (err) {
            console.error('Error retrieving user profile:', err.message);
            return res.status(500).json({ message: 'Error retrieving profile data.' });
        }
        if (!row) {
            return res.status(404).json({ message: 'User not found.' });
        }
        const currentYear = 2025;
        const academicYear = currentYear - row.joining_year + 1;
        res.json({
            id: row.id,
            name: row.name,
            email: row.email,
            joiningYear: row.joining_year,
            registrationNumber: row.reg_number,
            degree: row.degree,
            programme: row.programme,
            collegeEmail: row.college_email,
            currentAcademicYear: academicYear
        });
    });
});

// --- NEW/UPDATED: Single endpoint for note upload without OCR ---
app.post('/api/notes/upload', upload.single('pdfFile'), async (req, res) => {
    const { userId, degree, programme, faculty, courseTitle, courseCode, module, topic, tags } = req.body;
    const pdfFile = req.file;

    if (!userId || !degree || !programme || !faculty || !courseTitle || !courseCode || !module || !pdfFile) {
        return res.status(400).json({ message: 'Missing required fields for note upload.' });
    }

    try {
        // Step 1: Generate AI tags using the 'natural' library from user-provided data
        const tokenizer = new natural.WordTokenizer();
        const documentTokens = tokenizer.tokenize(courseTitle + ' ' + topic + ' ' + tags);
        const stopWords = new Set(natural.stopwords);
        const importantWords = documentTokens.filter(token => !stopWords.has(token.toLowerCase()));
        const aiTags = [...new Set(importantWords.slice(0, 5))].join(', ');
        const combinedTags = tags ? `${tags}, ${aiTags}` : aiTags;

        // Step 2: Save metadata to SQLite
        const fileUrl = `/uploads/${pdfFile.filename}`; // Placeholder URL for now
        const sql = `INSERT INTO notes (user_id, degree, programme, faculty, course_title, course_code, module, topic, tags, file_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        db.run(sql, [userId, degree, programme, faculty, courseTitle, courseCode, module, topic, combinedTags, fileUrl], function(err) {
            if (err) {
                console.error('Error inserting note into database:', err.message);
                return res.status(500).json({ message: 'Failed to save note metadata.' });
            }
            res.status(201).json({ message: 'Note metadata saved successfully!', noteId: this.lastID });
        });

    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Failed to save note.' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});