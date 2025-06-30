from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from functools import wraps
import os
from dotenv import load_dotenv
import re

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-change-this')
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/gamein')

# MongoDB connection
try:
    client = MongoClient(MONGO_URI)
    db = client['gamein']
    users_collection = db['users']
    print("Connected to MongoDB successfully!")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")

# Valid game genres
VALID_GENRES = [
    'Action', 'Adventure', 'RPG', 'Strategy', 'Sports', 
    'Simulation', 'FPS', 'MOBA', 'Racing', 'Puzzle'
]

def validate_password(password):
    """Validate password strength"""
    if len(password) < 6 or len(password) > 20:
        return "Password must be between 6 and 20 characters"
    if not re.search(r'\d', password):
        return "Password must contain at least 1 digit"
    if not re.search(r'[a-z]', password):
        return "Password must contain at least 1 lowercase letter"
    if not re.search(r'[A-Z]', password):
        return "Password must contain at least 1 uppercase letter"
    return None

def validate_user_data(data):
    """Validate user registration data"""
    errors = []
    
    # Check required fields
    required_fields = ['username', 'password', 'age', 'description']
    for field in required_fields:
        if not data.get(field):
            errors.append(f"{field.capitalize()} is required")
    
    # Validate username
    if data.get('username'):
        if len(data['username']) < 3:
            errors.append("Username must be at least 3 characters long")
        if users_collection.find_one({'username': data['username']}):
            errors.append("Username already exists")
    
    # Validate password
    if data.get('password'):
        password_error = validate_password(data['password'])
        if password_error:
            errors.append(password_error)
    
    # Validate age
    if data.get('age'):
        try:
            age = int(data['age'])
            if age < 13:
                errors.append("Age must be at least 13")
        except ValueError:
            errors.append("Age must be a valid number")
    
    # Validate description
    if data.get('description') and len(data['description']) > 1000:
        errors.append("Description must be less than 1000 characters")
    
    # Validate favorite genres
    if data.get('favorite_genres'):
        genres = [genre.strip() for genre in data['favorite_genres'].split(',')]
        for genre in genres:
            if genre and genre not in VALID_GENRES:
                errors.append(f"Invalid genre: {genre}")
    
    # Validate games (at least one game required)
    if not data.get('games') or not data['games'].strip():
        errors.append("At least one game is required")
    
    return errors

@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate user data
        validation_errors = validate_user_data(data)
        if validation_errors:
            return jsonify({'error': validation_errors[0]}), 400
        
        # Hash the password
        hashed_password = generate_password_hash(data['password'])
        
        # Prepare user document
        user_doc = {
            'username': data['username'],
            'password': hashed_password,
            'age': int(data['age']),
            'description': data['description'],
            'favorite_genres': [genre.strip() for genre in data.get('favorite_genres', '').split(',') if genre.strip()],
            'games': [game.strip() for game in data.get('games', '').split(',') if game.strip()],
            'created_at': datetime.datetime.utcnow(),
            'is_active': True
        }
        
        # Insert user into database
        result = users_collection.insert_one(user_doc)
        
        if result.inserted_id:
            return jsonify({
                'message': 'User registered successfully',
                'user_id': str(result.inserted_id)
            }), 201
        else:
            return jsonify({'error': 'Failed to create user'}), 500
            
    except Exception as e:
        print(f"Registration error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data or not data.get('username') or not data.get('password'):
            return jsonify({'error': 'Username and password are required'}), 400
        
        # Find user in database
        user = users_collection.find_one({'username': data['username']})
        
        if not user or not check_password_hash(user['password'], data['password']):
            return jsonify({'error': 'Invalid username or password'}), 401
        
        # Generate JWT token with 1 hour expiration
        token = jwt.encode({
            'user_id': str(user['_id']),
            'username': user['username'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }, app.config['SECRET_KEY'], algorithm='HS256')
        
        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': {
                'id': str(user['_id']),
                'username': user['username'],
                'age': user['age'],
                'favorite_genres': user['favorite_genres'],
                'games': user['games']
            }
        }), 200
        
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/users', methods=['GET'])
def get_users():
    try:
        users = list(users_collection.find(
            {'is_active': True}, 
            {'password': 0}  # Exclude password from response
        ))
        
        # Convert ObjectId to string
        for user in users:
            user['_id'] = str(user['_id'])
        
        return jsonify({'users': users}), 200
        
    except Exception as e:
        print(f"Get users error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/user/<user_id>', methods=['GET'])
def get_user(user_id):
    try:
        from bson import ObjectId
        
        user = users_collection.find_one(
            {'_id': ObjectId(user_id)}, 
            {'password': 0}
        )
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        user['_id'] = str(user['_id'])
        return jsonify({'user': user}), 200
        
    except Exception as e:
        print(f"Get user error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.datetime.utcnow(),
        'database': 'connected' if client.admin.command('ping') else 'disconnected'
    }), 200

def token_required(f):
    """Decorator to require JWT token for protected routes"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        try:
            # Remove 'Bearer ' prefix if present
            if token.startswith('Bearer '):
                token = token[7:]
            
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user_id = data['user_id']
            current_username = data['username']
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token is invalid'}), 401
        
        return f(current_user_id, current_username, *args, **kwargs)
    return decorated

@app.route('/verify-token', methods=['GET'])
@token_required
def verify_token(current_user_id, current_username):
    """Verify if JWT token is valid and not expired"""
    try:
        # Get user data from database
        from bson import ObjectId
        user = users_collection.find_one(
            {'_id': ObjectId(current_user_id)}, 
            {'password': 0}
        )
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        user['_id'] = str(user['_id'])
        return jsonify({
            'valid': True,
            'user': user
        }), 200
        
    except Exception as e:
        print(f"Token verification error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)