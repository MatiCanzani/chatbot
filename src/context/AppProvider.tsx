import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { AppContext } from '../layout/AppContext'; // Adjust the path as needed
import { supabase } from '../../supabaseClient'; // Adjust the path as needed

interface User {
  name: string;
  email: string;
}

interface ChatMessage {
  id: number;
  username: string;
  content: string;
  text: string; // Add this property
  timestamp: string; // Add this property
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State variables
  const [user, setUser] = useState<User | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [timer, setTimer] = useState<number>(60);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [routeHash, setRouteHash] = useState<string>('');
  const [isOnBottom, setIsOnBottom] = useState<boolean>(false);
  const [countryCode, setCountryCode] = useState<string>('');
  const [unviewedMessageCount, setUnviewedMessageCount] = useState<number>(0);
  const [session, setSession] = useState<any>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

const getMessagesAndSubscribe = async () => {
  setError('');
  try {
    // Initial message fetch
    const { data, error } = await supabase.from('messages').select().range(0, 49).order('id', { ascending: false });
    if (error) throw new Error(error.message);


    const mappedMessages = data.map((msg: any) => ({
      id: msg.id,
      username: msg.username,
      content: msg.content,
      text: msg.content, 
      timestamp: msg.timestamp 
    }));

    setMessages(mappedMessages); 

    supabase.channel('custom-all-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, (payload) => {
        const newMessage = payload.new as ChatMessage;
        setMessages((prevMessages) => [newMessage, ...prevMessages]);
        setUnviewedMessageCount((prevCount) => (newMessage.username === username ? 0 : prevCount + 1));
        if (newMessage.username === username) {
          scrollToBottom();
        }
      })
      .subscribe();
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    setError(errorMessage);
  }
};


  const randomUsername = () => `@user${Date.now().toString().slice(-4)}`;

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const onScroll = async (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 1) {
      setUnviewedMessageCount(0);
      setIsOnBottom(true);
    } else {
      setIsOnBottom(false);
    }

    if (target.scrollTop === 0) {
      try {
        const { data, error } = await supabase.from('messages').select().range(messages.length, messages.length + 49).order('id', { ascending: false });
        if (error) throw new Error(error.message);

        setMessages((prevMessages) => [...prevMessages, ...data as ChatMessage[]]);
        target.scrollTop = 1;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
      }
    }
  };

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      const fetchedUsername = session?.user.user_metadata.user_name || localStorage.getItem('username') || randomUsername();
      setUsername(fetchedUsername);
      localStorage.setItem('username', fetchedUsername);
    };

    fetchSession();
    getMessagesAndSubscribe();

    const storedCountryCode = localStorage.getItem('countryCode');
    if (storedCountryCode && storedCountryCode !== 'undefined') {
      setCountryCode(storedCountryCode);
    } else {
      fetch('https://api.db-ip.com/v2/free/self')
        .then((res) => res.json())
        .then(({ countryCode, error }) => {
          if (error) throw new Error(error);
          setCountryCode(countryCode);
          localStorage.setItem('countryCode', countryCode);
        })
        .catch((err) => {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error';
          console.error('Error getting location:', errorMessage);
        });
    }

    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
      const fetchedUsername = session?.user.user_metadata.user_name || localStorage.getItem('username') || randomUsername();
      setUsername(fetchedUsername);
      localStorage.setItem('username', fetchedUsername);
    });

    return () => {
      authSubscription.unsubscribe();
    };
  }, []);

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      questions,
      setQuestions,
      currentQuestionIndex,
      setCurrentQuestionIndex,
      score,
      setScore,
      timer,
      setTimer,
      messages,
      loadingInitial,
      error,
      getMessagesAndSubscribe,
      username,
      setUsername,
      randomUsername,
      routeHash,
      scrollRef,
      onScroll,
      scrollToBottom,
      isOnBottom,
      country: countryCode,
      unviewedMessageCount,
      session,
    }}>
      {children}
    </AppContext.Provider>
  );
};
