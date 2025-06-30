# GameIn Backend Server

A Python Flask backend server with MongoDB integration for the GameIn social gaming platform.

## Features

- User registration and authentication
- Password hashing and validation
- JWT token-based authentication
- MongoDB database integration
- CORS support for frontend integration
- Input validation and error handling

## Prerequisites

- Python 3.8 or higher
- MongoDB installed and running locally
- pip package manager

## Setup Instructions

1. **Navigate to the server directory:**

   ```bash
   cd server
   ```

2. **Create a virtual environment:**

   ```bash
   python3 -m venv venv
   ```

3. **Activate the virtual environment:**

   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```

4. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

5. **Start MongoDB:**

   ```bash
   # Using Homebrew on macOS
   brew services start mongodb-community

   # Or manually
   mongod
   ```

6. **Run the server:**
   ```bash
   python app.py
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### POST `/register`

Register a new user

- **Body**: JSON with username, password, age, description, favorite_genres, games
- **Response**: Success message with user_id or error

### POST `/login`

User authentication

- **Body**: JSON with username, password
- **Response**: JWT token and user data or error

### GET `/users`

Get all active users (passwords excluded)

- **Response**: List of users

### GET `/user/<user_id>`

Get specific user by ID

- **Response**: User data or error

### GET `/health`

Health check endpoint

- **Response**: Server and database status

## Environment Variables

Create a `.env` file in the server directory with:

```
MONGO_URI=mongodb://localhost:27017/gamein
SECRET_KEY=your-super-secret-key-change-this-in-production
FLASK_ENV=development
FLASK_DEBUG=True
```

## Database Structure

Users are stored in MongoDB with the following schema:

- `username`: String (unique, 3+ characters)
- `password`: String (hashed, 6-20 chars with uppercase, lowercase, digit)
- `age`: Number (13+)
- `description`: String (max 1000 characters)
- `favorite_genres`: Array of strings
- `games`: Array of strings
- `created_at`: DateTime
- `is_active`: Boolean

## Security Features

- Password hashing using Werkzeug
- JWT token authentication
- Input validation and sanitization
- CORS protection
- Environment variable configuration
