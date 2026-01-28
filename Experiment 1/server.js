var http = require('http');

http.createServer(function (req, res) {
    // Set the header to notify the browser this is HTML
    res.writeHead(200, { 'Content-Type': 'text/html' });

    // Using backticks (`) allows for multi-line strings and cleaner HTML
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Node.js HTML Server</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
            nav { background: #333; padding: 10px; color: white; }
            nav a { color: white; margin-right: 15px; text-decoration: none; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .container { border: 1px solid #ccc; padding: 20px; border-radius: 5px; }
        </style>
    </head>
    <body>
        <nav>
            <a href="#">Home</a>
            <a href="#">About</a>
            <a href="#">Services</a>
        </nav>

        <div class="container">
            <h1>Welcome to my Node.js Server</h1>
            <p>This page is being generated dynamically by a <strong>Node.js</strong> backend.</p>
            
            <h3>Sample Data Table</h3>
            <table>
                <tr>
                    <th>Feature</th>
                    <th>Status</th>
                </tr>
                <tr>
                    <td>HTTP Headers</td>
                    <td>✅ Active</td>
                </tr>
                <tr>
                    <td>HTML Rendering</td>
                    <td>✅ Active</td>
                </tr>
                <tr>
                    <td>CSS Styling</td>
                    <td>✅ Active</td>
                </tr>
            </table>

            <button onclick="alert('Hello from Node!')">Click Me</button>
        </div>
    </body>
    </html>
    `;

    res.write(htmlContent);
    res.end();
}).listen(8080);

console.log('Server running at http://localhost:8080/');
