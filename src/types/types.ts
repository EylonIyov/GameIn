export interface Game {
  id: string;
  name: string;
  genre: string;
}

export interface UserProfile {
  id: string;
  username: string;
  age: number;
  games: Game[];
  favoriteGenres: string[];
  description: string;
  avatarUrl?: string;
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: string;
  likes: number;
}

export interface User {
  id: string;
  username: string;
  age: number;
  favorite_genres: string[];
  games: string[];
  description?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}