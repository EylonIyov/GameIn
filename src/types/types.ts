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