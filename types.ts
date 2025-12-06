export interface LogoItem {
  id: string;
  title: string;
  imageUrl: string; // Base64 or URL
  date: string;
  link?: string;
}

export interface VideoItem {
  id: string;
  title: string;
  youtubeUrl: string;
  videoId: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
}

export interface Skill {
  name: string;
  level: number; // 0-100
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}
