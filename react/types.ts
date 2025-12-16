export enum PageView {
  HOME = 'HOME',
  FEED = 'FEED',
  GENERATE = 'GENERATE',
  MY_PAGE = 'MY_PAGE',
  LOGIN = 'LOGIN',
  LOADING = 'LOADING',
  RESULT = 'RESULT'
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  isLoggedIn: boolean;
}

export interface FeedItem {
  id: string;
  imageUrl: string;
  likes: number;
  tags: string[];
  user: string;
}

export interface GenerationResult {
  imageUrl: string; // The generated/processed image
  analysis: string;
  recommendation: string;
  tags: string[];
}

// Gemini specific types for our service
export interface GeminiAnalysisResponse {
  analysis: string;
  recommendation: string;
  tags: string[];
}

export interface Task {
    id: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    result: any; // This will contain the creation data or an error message
}
