
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  type: 'PDF' | 'PPT' | 'DOC' | 'IMG';
  category: string;
  size: string;
  date: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  isUrgent: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isLoading?: boolean;
}

export interface UserLog {
  email: string;
  password?: string; // 4 digit PIN
  lastAccess: string;
  accessCount: number;
}

export type ViewState = 'home' | 'faq' | 'documents' | 'announcements' | 'admin';
