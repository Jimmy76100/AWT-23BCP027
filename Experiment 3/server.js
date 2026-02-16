const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const port = 8080;

// --- CONFIGURATION ---
// 1. Database Credentials (You can define them here)
const DB_HOST = 'localhost';
const DB_USER = 'root';
const DB_PASS = '';
const DB_NAME = 'shopping_db';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

// --- DATABASE CONNECTION ---
const db = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME
});

db.connect((err) => {
    if (err) console.error('❌ DB Connection Error: ' + err.stack);
    else console.log('✅ Connected to MySQL Database');
});

// --- HELPER: HTML TEMPLATE ---
function page(content, user = null) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>My Private List</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <style>
            body { background: #f0f2f5; font-family: sans-serif; }
            .container { max-width: 600px; margin-top: 50px; }
            .card { border: none; shadow: 0 4px 12px rgba(0,0,0,0.1); }
        </style>
    </head>
    <body>
        <nav class="navbar navbar-dark bg-dark">
            <div class="container-fluid justify-content-center">
                <span class="navbar-brand mb-0 h1">🛒 User-Defined Shopping List</span>
            </div>
        </nav>
        <div class="container">
            ${content}
        </div>
    </body>
    </html>
    `;
}

// --- ROUTES ---

// 1. Login Page
app.get('/login', (req, res) => {
    const html = `
        <div class="card p-4">
            <h3 class="text-center mb-3">Login</h3>
            ${req.query.registered ? '<div class="alert alert-success">Account created! Log in now.</div>' : ''}
            ${req.query.error ? '<div class="alert alert-danger">Invalid username or password.</div>' : ''}
            
            <form action="/auth" method="POST">
                <div class="mb-3">
                    <label>Username</label>
                    <input type="text" name="username" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label>Password</label>
                    <input type="password" name="password" class="form-control" required>
                </div>
                <button type="submit" class="btn btn-primary w-100">Login</button>
            </form>
            <div class="text-center mt-3">
                <a href="/register">Create your own User ID</a>
            </div>
        </div>
    `;
    res.send(page(html));
});

// 2. Register Page
app.get('/register', (req, res) => {
    const html = `
        <div class="card p-4">
            <h3 class="text-center mb-3">Register New User</h3>
            <form action="/register-user" method="POST">
                <div class="mb-3">
                    <label>Choose Username</label>
                    <input type="text" name="username" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label>Choose Password</label>
                    <input type="password" name="password" class="form-control" required>
                </div>
                <button type="submit" class="btn btn-success w-100">Sign Up</button>
            </form>
            <div class="text-center mt-3"><a href="/login">Back to Login</a></div>
        </div>
    `;
    res.send(page(html));
});

// 3. Handle Registration
app.post('/register-user', (req, res) => {
    const { username, password } = req.body;
    // We insert the USER DEFINED username/password into the DB
    db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err) => {
        if (err) return res.send("Error: Username likely taken.");
        res.redirect('/login?registered=true');
    });
});

// 4. Handle Login
app.post('/auth', (req, res) => {
    const { username, password } = req.body;
    
    db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
        if (results.length > 0) {
            req.session.loggedin = true;
            req.session.username = username;
            req.session.userId = results[0].id; // IMPORTANT: Save the User's ID
            res.redirect('/');
        } else {
            res.redirect('/login?error=true');
        }
    });
});

// 5. The Dashboard (Private to the User)
app.get('/', (req, res) => {
    if (!req.session.loggedin) return res.redirect('/login');

    // QUERY: Select ONLY items that belong to the logged-in user (req.session.userId)
    const sql = 'SELECT * FROM items WHERE user_id = ?';
    
    db.query(sql, [req.session.userId], (err, results) => {
        if (err) throw err;

        const listItems = results.map(item => `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                ${item.name}
                <form action="/delete" method="POST" class="m-0">
                    <input type="hidden" name="id" value="${item.id}">
                    <button type="submit" class="btn btn-outline-danger btn-sm">Delete</button>
                </form>
            </li>
        `).join('');

        const html = `
            <div class="card p-4">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h4>Hello, ${req.session.username} 👋</h4>
                    <a href="/logout" class="btn btn-sm btn-outline-secondary">Logout</a>
                </div>

                <form action="/add" method="POST" class="d-flex gap-2 mb-3">
                    <input type="text" name="itemName" class="form-control" placeholder="Add to YOUR list..." required>
                    <button class="btn btn-primary" type="submit">Add</button>
                </form>

                <ul class="list-group">
                    ${listItems}
                </ul>
                ${results.length === 0 ? '<p class="text-muted text-center mt-3">Your list is empty.</p>' : ''}
            </div>
        `;
        res.send(page(html));
    });
});

// 6. Add Item (Linked to User ID)
app.post('/add', (req, res) => {
    if (!req.session.loggedin) return res.redirect('/login');
    
    // INSERT with the User ID
    const sql = 'INSERT INTO items (name, user_id) VALUES (?, ?)';
    db.query(sql, [req.body.itemName, req.session.userId], (err) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// 7. Delete Item (Security Check included)
app.post('/delete', (req, res) => {
    if (!req.session.loggedin) return res.redirect('/login');

    // DELETE only if the item belongs to the current user (Security Best Practice)
    const sql = 'DELETE FROM items WHERE id = ? AND user_id = ?';
    db.query(sql, [req.body.id, req.session.userId], (err) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// 8. Logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
