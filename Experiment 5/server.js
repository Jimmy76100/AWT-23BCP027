const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 8080;

// --- MIDDLEWARE ---
app.use(cors()); // 🌉 The bridge allowing React (3000) to talk to Node (8080)
app.use(express.json()); // 📦 CRUCIAL: Allows Node to read the JSON data React sends
app.use(express.urlencoded({ extended: true }));

// --- CONFIGURATION ---
const DB_HOST = 'localhost';
const DB_USER = 'root';
const DB_PASS = ''; // XAMPP default
const DB_NAME = 'shopping_db';
const DB_PORT = 3306;

// --- DATABASE CONNECTION ---
const db = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    port: DB_PORT 
});

db.connect((err) => {
    if (err) console.error('❌ DB Connection Error: ' + err.stack);
    else console.log('✅ Connected to MySQL Database');
});

// ==========================================
//        REACT API ROUTES 
// ==========================================

// 1. Fetch Products for the Storefront
app.get('/api/products', (req, res) => {
    const sql = 'SELECT * FROM products';
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Could not fetch products" });
        }
        res.json(results);
    });
});

// 2. Register a New User
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;

    db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err, results) => {
        if (err) {
            // ER_DUP_ENTRY means the username is already taken
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ success: false, message: "Username already exists!" });
            }
            return res.status(500).json({ error: "Database error" });
        }
        res.json({ success: true, message: "Registration successful! You can now log in." });
    });
});

// 3. Login an Existing User
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        
        if (results.length > 0) {
            // Success! Send a thumbs up and the user data back to React
            res.json({ success: true, user: results[0], message: "Login successful!" });
        } else {
            // Failed
            res.status(401).json({ success: false, message: "Invalid username or password" });
        }
    });
});

// --- START SERVER ---
app.listen(port, () => {
    console.log(`🚀 API Server running at http://localhost:${port}`);
});
