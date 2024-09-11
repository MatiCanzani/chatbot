import { createContext, Dispatch, SetStateAction, useContext } from 'react';

interface User {
  name: string;
  email: string;
}

interface Message {
  text: string;
  timestamp: string;
  id: number;
  username: string;
  content: string; 
}

interface AppContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  questions: any[];
  setQuestions: Dispatch<SetStateAction<any[]>>;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: Dispatch<SetStateAction<number>>;
  score: number;
  setScore: Dispatch<SetStateAction<number>>;
  timer: number;
  setTimer: Dispatch<SetStateAction<number>>;
  messages: Message[];
  loadingInitial: boolean;
  error: string;
  getMessagesAndSubscribe: () => void;
  username: string;
  setUsername: Dispatch<SetStateAction<string>>;
  randomUsername: () => string;
  routeHash: string;
  scrollRef: React.RefObject<HTMLDivElement>;
  onScroll: (event: React.UIEvent<HTMLDivElement>) => void;
  scrollToBottom: () => void;
  isOnBottom: boolean;
  country: string;
  unviewedMessageCount: number;
  session: any;
  isChatCompleted: boolean;
  setIsChatCompleted: Dispatch<SetStateAction<boolean>>;
}


export const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === null) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};


