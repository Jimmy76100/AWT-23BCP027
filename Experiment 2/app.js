const express = require('express');
const path = require('path');
const app = express();

// --- MIDDLEWARE ---

// 1. Built-in middleware to parse URL-encoded bodies (from HTML forms)
app.use(express.urlencoded({ extended: true }));

// 2. Custom Validation Middleware
const validateRegistration = (req, res, next) => {
    const { username, password } = req.body;

    // Check if fields are empty
    if (!username || !password) {
        // In a real app, you might redirect with a query param
        // For this example, we send a script to trigger a browser alert
        return res.send(`
            <script>
                alert("Please fill in both the Student Name and Password!");
                window.history.back();
            </script>
        `);
    }
    next(); // Move to the next function if validation passes
};

// --- DATA STORAGE (In-memory) ---
const students = [];

// --- ROUTES ---

// 1. Serve the HTML Form
app.get('/', (req, res) => {
    res.send(`
        <h2>Student Course Registration</h2>
        <form action="/register" method="POST">
            <label>Student Name:</label><br>
            <input type="text" name="username"><br><br>
            <label>Password:</label><br>
            <input type="password" name="password"><br><br>
            <button type="submit">Submit</button>
        </form>
    `);
});

// 2. Handle Form Submission
// Note: validateRegistration middleware runs BEFORE the final handler
app.post('/register', validateRegistration, (req, res) => {
    const { username, password } = req.body;
    
    // Storing data
    students.push({ username, password });
    
    console.log('Current Students:', students);
    res.send(`<h1>Registration Successful!</h1><p>Welcome, ${username}.</p>`);
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
