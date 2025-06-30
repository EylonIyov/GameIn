import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Zoom,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const success = await login(formData.username, formData.password);
      
      if (success) {
        // Redirect to social wall after successful login
        navigate('/social');
      } else {
        setError('Invalid username or password');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Network error. Please check if the server is running and try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Zoom in={true} timeout={500}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          maxWidth: 400, 
          mx: 'auto', 
          mt: 8,
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
          }
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{
            textAlign: 'center',
            background: 'linear-gradient(45deg, #818cf8, #c084fc)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 4
          }}
        >
          Welcome Back
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Box 
          component="form" 
          onSubmit={handleSubmit} 
          sx={{ 
            '& .MuiTextField-root': {
              transition: 'transform 0.2s ease-in-out',
              '&:focus-within': {
                transform: 'translateX(8px)'
              }
            }
          }}
        >
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            margin="normal"
            required
            disabled={submitting}
            sx={{ animation: 'fadeIn 0.5s ease-out' }}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
            disabled={submitting}
            sx={{ animation: 'fadeIn 0.5s ease-out', animationDelay: '0.1s' }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={submitting}
            sx={{
              mt: 3,
              height: 48,
              borderRadius: '24px',
              background: 'linear-gradient(45deg, #818cf8, #c084fc)',
              boxShadow: '0 3px 15px 2px rgba(99, 102, 241, 0.3)',
              animation: 'fadeIn 0.5s ease-out',
              animationDelay: '0.2s',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 5px 20px 2px rgba(168, 85, 247, 0.4)',
                background: 'linear-gradient(45deg, #6366f1, #a855f7)',
              }
            }}
          >
            {submitting ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
          </Button>
        </Box>
      </Paper>
    </Zoom>
  );
};

export default LoginForm;