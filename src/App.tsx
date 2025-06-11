import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline, AppBar, Toolbar, Button, Box, Typography, Fade, Slide } from '@mui/material';
import { theme } from './theme/theme';
import RegisterForm from './components/RegisterForm';
import SocialWall from './components/SocialWall';

// Animated route wrapper component
const AnimatedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  return (
    <Fade in={true} timeout={600}>
      <Slide direction="up" in={true} timeout={400}>
        <Box>{children}</Box>
      </Slide>
    </Fade>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static" sx={{
            background: 'linear-gradient(45deg, #3f51b5 30%, #7c4dff 90%)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              background: 'linear-gradient(45deg, #7c4dff 30%, #3f51b5 90%)',
            }
          }}>
            <Toolbar>
              <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                  flexGrow: 1,
                  fontWeight: 'bold',
                  letterSpacing: '1px',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                GameIn
              </Typography>
              <Box sx={{ 
                '& > button': { 
                  mx: 1,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    backgroundColor: 'rgba(255,255,255,0.2)'
                  }
                }
              }}>
                <Button color="inherit" component={Link} to="/">
                  Home
                </Button>
                <Button color="inherit" component={Link} to="/register">
                  Register
                </Button>
                <Button color="inherit" component={Link} to="/social">
                  Social Wall
                </Button>
              </Box>
            </Toolbar>
          </AppBar>

          <Box sx={{ p: 3 }}>
            <Routes>
              <Route path="/" element={
                <AnimatedRoute>
                  <Box sx={{ 
                    textAlign: 'center', 
                    mt: 8,
                    '& > *': {
                      animation: 'fadeIn 0.8s ease-out'
                    }
                  }}>
                    <Typography 
                      variant="h2" 
                      gutterBottom
                      sx={{
                        fontWeight: 'bold',
                        background: 'linear-gradient(45deg, #3f51b5, #7c4dff)',
                        backgroundClip: 'text',
                        textFillColor: 'transparent',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      Welcome to GameIn
                    </Typography>
                    <Typography 
                      variant="h5" 
                      color="text.secondary" 
                      sx={{ 
                        mb: 4,
                        opacity: 0,
                        animation: 'slideUp 0.8s ease-out forwards',
                        animationDelay: '0.3s'
                      }}
                    >
                      The Platform That Connects Gamers
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      component={Link}
                      to="/register"
                      size="large"
                      sx={{
                        mt: 2,
                        px: 4,
                        py: 1.5,
                        borderRadius: '30px',
                        background: 'linear-gradient(45deg, #3f51b5 30%, #7c4dff 90%)',
                        boxShadow: '0 3px 15px 2px rgba(125, 77, 255, 0.3)',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: '0 5px 20px 2px rgba(125, 77, 255, 0.4)',
                        }
                      }}
                    >
                      Join Now
                    </Button>
                  </Box>
                </AnimatedRoute>
              } />
              <Route path="/register" element={
                <AnimatedRoute>
                  <RegisterForm />
                </AnimatedRoute>
              } />
              <Route path="/social" element={
                <AnimatedRoute>
                  <SocialWall />
                </AnimatedRoute>
              } />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
