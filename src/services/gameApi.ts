import axios from 'axios';

export interface Game {
  id: number;
  name: string;
  background_image: string;
  genres: { id: number; name: string }[];
}

const API_KEY = '1de9424f8640445e8ed8f3cf3f115d7b'; // This is a free API key for demo purposes
const BASE_URL = 'https://api.rawg.io/api';

export const searchGames = async (searchTerm: string): Promise<Game[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/games`, {
      params: {
        key: API_KEY,
        search: searchTerm,
        page_size: 10,
        ordering: '-rating'
      }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching games:', error);
    return [];
  }
};

export const getPopularGames = async (): Promise<Game[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/games`, {
      params: {
        key: API_KEY,
        ordering: '-rating',
        page_size: 50
      }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching popular games:', error);
    return [];
  }
};

// Authentication API functions
export const authService = {
  login: async (username: string, password: string) => {
    try {
      const response = await axios.post(`${AUTH_BASE_URL}/login`, {
        username,
        password
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  verifyToken: async (token: string) => {
    try {
      const response = await axios.get(`${AUTH_BASE_URL}/verify-token`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Token management
  saveToken: (token: string) => {
    localStorage.setItem('gamein_token', token);
  },

  getToken: (): string | null => {
    return localStorage.getItem('gamein_token');
  },

  removeToken: () => {
    localStorage.removeItem('gamein_token');
  },

  saveUser: (user: User) => {
    localStorage.setItem('gamein_user', JSON.stringify(user));
  },

  getUser: (): User | null => {
    const userStr = localStorage.getItem('gamein_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  removeUser: () => {
    localStorage.removeItem('gamein_user');
  }
};