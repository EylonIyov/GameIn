from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)

# Local MongoDB connection
MONGO_URI = "mongodb://localhost:27017"
client = MongoClient(MONGO_URI)
db = client['gamein']
users_collection = db['users']

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data['username']
    password = data['password']
    age = data['age']
    description = data['description']
    favorite_genres = list(map(str.strip, data['favorite_genres'].split(',')))
    games = list(map(str.strip, data['games'].split(',')))
    
    # Check if username already exists
    if users_collection.find_one({'username': username}):
        return jsonify({'error': 'Username already exists'}), 400
    
    # Check if password is strong enough
    if len(password) < 6 or len(password) > 20:
        return jsonify({'error': 'Password must be between 6 and 20 characters'}), 400
    
    # Check if age is a valid number
    if not age.isdigit() or int(age) < 13:
        return jsonify({'error': 'Age must be a number and at least 13'}), 400
    
    # Check if description is too long
    if len(description) > 1000:
        return jsonify({'error': 'Description must be less than 1000 characters'}), 400
    
    # Check if favorite genres are valid
    for genre in favorite_genres:
        if genre not in GENRE_LIST:
            return jsonify({'error': f'Invalid genre: {genre}'}), 400

    # Check if games are valid

    if not data:
        return jsonify({'error': 'No data provided'}), 400

    # You can add more validation here if needed
    users_collection.insert_one(data)
    return jsonify({'message': 'User registered successfully'}), 201

if __name__ == '__main__':
    app.run(debug=True) 