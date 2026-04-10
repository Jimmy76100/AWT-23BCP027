from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Configure a local SQLite database (it will create an 'items.db' file)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///items.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# --- 1. Define the Database Model ---
class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200))

    # Helper method to convert the object to a dictionary for JSON response
    def to_dict(self):
        return {"id": self.id, "name": self.name, "description": self.description}

# Create the database tables before handling requests
with app.app_context():
    db.create_all()

# --- 2. CRUD Routes ---
# ROOT: Welcome message
@app.route('/', methods=['GET'])
def home():
    return "Welcome to the Flask CRUD API! Navigate to /items to interact with the data."
# CREATE: Add a new item
@app.route('/items', methods=['POST'])
def create_item():
    data = request.get_json()
    if not data or not 'name' in data:
        return jsonify({"error": "Name is required"}), 400
    
    new_item = Item(name=data['name'], description=data.get('description', ''))
    db.session.add(new_item)
    db.session.commit()
    
    return jsonify(new_item.to_dict()), 201

# READ: Get all items
@app.route('/items', methods=['GET'])
def get_items():
    items = Item.query.all()
    return jsonify([item.to_dict() for item in items]), 200

# READ: Get a specific item by ID
@app.route('/items/<int:item_id>', methods=['GET'])
def get_item(item_id):
    item = db.session.get(Item, item_id)
    if not item:
        return jsonify({"error": "Item not found"}), 404
    return jsonify(item.to_dict()), 200

# UPDATE: Update an existing item
@app.route('/items/<int:item_id>', methods=['PUT'])
def update_item(item_id):
    item = db.session.get(Item, item_id)
    if not item:
        return jsonify({"error": "Item not found"}), 404
    
    data = request.get_json()
    # Update fields if they are provided, otherwise keep existing values
    item.name = data.get('name', item.name)
    item.description = data.get('description', item.description)
    
    db.session.commit()
    return jsonify(item.to_dict()), 200

# DELETE: Delete an item
@app.route('/items/<int:item_id>', methods=['DELETE'])
def delete_item(item_id):
    item = db.session.get(Item, item_id)
    if not item:
        return jsonify({"error": "Item not found"}), 404
    
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Item deleted successfully"}), 200

# --- 3. Run the App ---
if __name__ == '__main__':
    app.run(debug=True)
