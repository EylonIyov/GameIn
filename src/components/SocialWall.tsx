import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Avatar,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Grow,
  Zoom,
} from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { Post } from '../types/types';

const SocialWall: React.FC = () => {
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    const post: Post = {
      id: Date.now().toString(),
      userId: 'current-user-id', // TODO: Replace with actual user ID
      username: 'Current User', // TODO: Replace with actual username
      content: newPost,
      timestamp: new Date().toISOString(),
      likes: 0,
    };

    setPosts([post, ...posts]);
    setNewPost('');
  };

  const handleLike = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 2 }}>
      <Zoom in={true} timeout={500}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 2, 
            mb: 4,
            background: 'linear-gradient(to right bottom, #ffffff, #f8f9ff)',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
            }
          }}
        >
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{
              background: 'linear-gradient(45deg, #6366f1, #a855f7)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold'
            }}
          >
            What's on your mind?
          </Typography>
          <form onSubmit={handlePostSubmit}>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share your gaming thoughts..."
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  transition: 'transform 0.2s ease-in-out',
                  '&:focus-within': {
                    transform: 'translateX(8px)'
                  }
                }
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!newPost.trim()}
              sx={{
                borderRadius: '20px',
                background: 'linear-gradient(45deg, #6366f1, #a855f7)',
                boxShadow: '0 3px 15px 2px rgba(99, 102, 241, 0.3)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 5px 20px 2px rgba(168, 85, 247, 0.4)',
                  background: 'linear-gradient(45deg, #4f46e5, #9333ea)',
                }
              }}
            >
              Post
            </Button>
          </form>
        </Paper>
      </Zoom>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {posts.map((post, index) => (
          <Grow 
            key={post.id} 
            in={true} 
            timeout={500} 
            style={{ transformOrigin: '0 0 0' }}
          >
            <Card sx={{
              background: 'linear-gradient(to right bottom, #ffffff, #f8f9ff)',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
              }
            }}>
              <CardHeader
                avatar={
                  <Avatar sx={{
                    background: 'linear-gradient(45deg, #6366f1, #a855f7)',
                  }}>
                    {post.username[0]}
                  </Avatar>
                }
                title={
                  <Typography sx={{ fontWeight: 'bold' }}>
                    {post.username}
                  </Typography>
                }
                subheader={new Date(post.timestamp).toLocaleString()}
              />
              <CardContent>
                <Typography variant="body1" sx={{ mb: 2 }}>{post.content}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton 
                    onClick={() => handleLike(post.id)} 
                    color="primary"
                    sx={{
                      transition: 'transform 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      }
                    }}
                  >
                    {post.likes > 0 ? <Favorite /> : <FavoriteBorder />}
                  </IconButton>
                  <Typography 
                    variant="body2"
                    sx={{
                      background: post.likes > 0 ? 'linear-gradient(45deg, #6366f1, #a855f7)' : 'inherit',
                      backgroundClip: post.likes > 0 ? 'text' : 'inherit',
                      WebkitBackgroundClip: post.likes > 0 ? 'text' : 'inherit',
                      WebkitTextFillColor: post.likes > 0 ? 'transparent' : 'inherit',
                      fontWeight: post.likes > 0 ? 'bold' : 'normal',
                    }}
                  >
                    {post.likes} likes
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grow>
        ))}
      </Box>
    </Box>
  );
};

export default SocialWall; 