import axios from 'axios';

const API_KEY = '1de9424f8640445e8ed8f3cf3f115d7b'; // This is a free API key for demo purposes
const BASE_URL = 'https://api.rawg.io/api';

export interface Game {
  id: number;
  name: string;
  background_image: string;
  genres: { id: number; name: string }[];
}

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