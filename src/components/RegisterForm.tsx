import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Zoom,
  CircularProgress,
  Autocomplete,
  AutocompleteRenderGetTagProps,
  FormHelperText,
} from '@mui/material';
import { searchGames, getPopularGames, Game } from '../services/gameApi';

const GAME_GENRES = [
  'Action',
  'Adventure',
  'RPG',
  'Strategy',
  'Sports',
  'Simulation',
  'FPS',
  'MOBA',
  'Racing',
  'Puzzle',
];

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    age: '',
    description: '',
    favoriteGenres: [] as string[],
  });

  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
    games: '',
  });

  const [selectedGames, setSelectedGames] = useState<Game[]>([]);
  const [gameOptions, setGameOptions] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [popularGames, setPopularGames] = useState<Game[]>([]);

  const validatePassword = (password: string): string => {
    if (password.length < 6 || password.length > 20) {
      return 'Password must be between 6 and 20 characters';
    }
    if (!/\d/.test(password)) {
      return 'Password must contain at least 1 digit';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least 1 lowercase letter';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least 1 uppercase letter';
    }
    return '';
  };

  useEffect(() => {
    // Load popular games when component mounts
    const loadPopularGames = async () => {
      setLoading(true);
      const games = await getPopularGames();
      setPopularGames(games);
      setGameOptions(games);
      setLoading(false);
    };
    loadPopularGames();
  }, []);

  useEffect(() => {
    // Search games when search term changes
    const searchGamesList = async () => {
      if (searchTerm) {
        setLoading(true);
        const games = await searchGames(searchTerm);
        // Combine search results with selected games to prevent them from disappearing
        const combinedGames = [...games];
        
        // Add selected games that aren't in the search results
        selectedGames.forEach(selectedGame => {
          if (!combinedGames.some(game => game.id === selectedGame.id)) {
            combinedGames.push(selectedGame);
          }
        });
        
        setGameOptions(combinedGames);
        setLoading(false);
      } else {
        // If search is cleared, show popular games
        setGameOptions(popularGames);
      }
    };

    const debounceTimer = setTimeout(searchGamesList, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, selectedGames, popularGames]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Validate password
    if (name === 'password') {
      const passwordError = validatePassword(value);
      setErrors(prev => ({
        ...prev,
        password: passwordError,
        confirmPassword: value !== formData.confirmPassword ? 'Passwords do not match' : '',
      }));
    }

    // Validate confirm password
    if (name === 'confirmPassword') {
      setErrors(prev => ({
        ...prev,
        confirmPassword: value !== formData.password ? 'Passwords do not match' : '',
      }));
    }
  };

  const handleGenreChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    setFormData({
      ...formData,
      favoriteGenres: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate before submitting
    const passwordError = validatePassword(formData.password);
    const gamesError = selectedGames.length === 0 ? 'Please select at least one game' : '';
    if (passwordError || formData.password !== formData.confirmPassword || gamesError) {
      setErrors({
        password: passwordError,
        confirmPassword: formData.password !== formData.confirmPassword ? 'Passwords do not match' : '',
        games: gamesError,
      });
      return;
    }

    console.log({
      ...formData,
      games: selectedGames.map(game => game.name),
    });
  };

  return (
    <Zoom in={true} timeout={500}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          maxWidth: 600, 
          mx: 'auto', 
          mt: 4,
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
          Join GameIn
        </Typography>
        <Box 
          component="form" 
          onSubmit={handleSubmit} 
          sx={{ 
            mt: 2,
            '& .MuiTextField-root, & .MuiFormControl-root': {
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
            error={!!errors.password}
            helperText={errors.password}
            sx={{ animation: 'fadeIn 0.5s ease-out', animationDelay: '0.1s' }}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            margin="normal"
            required
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            sx={{ animation: 'fadeIn 0.5s ease-out', animationDelay: '0.15s' }}
          />
          <TextField
            fullWidth
            label="Age"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            margin="normal"
            required
            sx={{ animation: 'fadeIn 0.5s ease-out', animationDelay: '0.2s' }}
          />
          <Autocomplete
            multiple
            options={gameOptions}
            value={selectedGames}
            loading={loading}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(_, newValue) => {
              // Remove duplicates based on game ID
              const uniqueGames = newValue.filter((game, index, self) =>
                index === self.findIndex((g) => g.id === game.id)
              );
              setSelectedGames(uniqueGames);
              // Clear error when user selects a game
              if (uniqueGames.length > 0 && errors.games) {
                setErrors(prev => ({ ...prev, games: '' }));
              }
            }}
            onInputChange={(_, newInputValue) => setSearchTerm(newInputValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Games You Play"
                margin="normal"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
                sx={{ animation: 'fadeIn 0.5s ease-out', animationDelay: '0.3s' }}
                error={!!errors.games}
                helperText={errors.games}
              />
            )}
            renderTags={(value: Game[], getTagProps: AutocompleteRenderGetTagProps) =>
              value.map((option: Game, index: number) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option.id}
                  label={option.name}
                  sx={{
                    background: 'linear-gradient(45deg, #818cf8, #c084fc)',
                    color: 'white',
                    fontWeight: 500,
                    '& .MuiChip-deleteIcon': {
                      color: 'rgba(255, 255, 255, 0.7)',
                      '&:hover': { color: 'white' }
                    }
                  }}
                />
              ))
            }
          />
          <FormControl 
            fullWidth 
            margin="normal"
            sx={{ animation: 'fadeIn 0.5s ease-out', animationDelay: '0.4s' }}
          >
            <InputLabel>Favorite Genres</InputLabel>
            <Select
              multiple
              value={formData.favoriteGenres}
              onChange={handleGenreChange}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip 
                      key={value} 
                      label={value}
                      sx={{
                        background: 'linear-gradient(45deg, #818cf8, #c084fc)',
                        color: 'white',
                        fontWeight: 500
                      }}
                    />
                  ))}
                </Box>
              )}
            >
              {GAME_GENRES.map((genre) => (
                <MenuItem key={genre} value={genre}>
                  {genre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="About Me"
            name="description"
            value={formData.description}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={4}
            required
            sx={{ animation: 'fadeIn 0.5s ease-out', animationDelay: '0.5s' }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mt: 3,
              height: 48,
              borderRadius: '24px',
              background: 'linear-gradient(45deg, #818cf8, #c084fc)',
              boxShadow: '0 3px 15px 2px rgba(99, 102, 241, 0.3)',
              animation: 'fadeIn 0.5s ease-out',
              animationDelay: '0.6s',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 5px 20px 2px rgba(168, 85, 247, 0.4)',
                background: 'linear-gradient(45deg, #6366f1, #a855f7)',
              }
            }}
          >
            Create Account
          </Button>
        </Box>
      </Paper>
    </Zoom>
  );
};

export default RegisterForm; 

export const registerUser = async (userData: any) => {
  try {
    const response = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Failed to register user');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};