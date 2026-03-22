from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)
# 🌉 Enable CORS so React (Port 3000) can talk to Flask (Port 8080)
CORS(app) 

# --- CONFIGURATION ---
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '', # XAMPP default
    'database': 'shopping_db',
    'port': 3306
}

# --- HELPER: Get Database Connection ---
def get_db_connection():
    try:
        conn = mysql.connector.connect(**db_config)
        return conn
    except Error as e:
        print(f"❌ DB Connection Error: {e}")
        return None

# Test connection on startup
test_conn = get_db_connection()
if test_conn and test_conn.is_connected():
    print("✅ Connected to MySQL Database")
    test_conn.close()

# ==========================================
#        FLASK API ROUTES 
# ==========================================

# 1. Fetch Products for the Storefront
@app.route('/api/products', methods=['GET'])
def get_products():
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500
    
    # dictionary=True ensures data is returned as JSON objects, just like Node did!
    cursor = conn.cursor(dictionary=True) 
    cursor.execute("SELECT * FROM products")
    products = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    return jsonify(products)

# 2. Register a New User
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("INSERT INTO users (username, password) VALUES (%s, %s)", (username, password))
        conn.commit()
        response = {"success": True, "message": "Registration successful! You can now log in."}
        status_code = 200
    except mysql.connector.IntegrityError:
        # Catch duplicate usernames
        response = {"success": False, "message": "Username already exists!"}
        status_code = 400
    except Error as e:
        response = {"error": str(e)}
        status_code = 500
    finally:
        cursor.close()
        conn.close()

    return jsonify(response), status_code

# 3. Login an Existing User
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute("SELECT * FROM users WHERE username = %s AND password = %s", (username, password))
    user = cursor.fetchone()
    
    cursor.close()
    conn.close()

    if user:
        return jsonify({"success": True, "user": user, "message": "Login successful!"})
    else:
        return jsonify({"success": False, "message": "Invalid username or password"}), 401

# --- START SERVER ---
if __name__ == '__main__':
    # Running on port 8080 to match React's expectations perfectly
    app.run(debug=True, port=8080)
