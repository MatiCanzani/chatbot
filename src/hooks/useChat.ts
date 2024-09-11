import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../supabaseClient';
import { botQuestions } from '../utils/botQuestions';
import { v4 as uuidv4 } from 'uuid';

interface MessageData {
  id: string;
  username: string;
  text: string;
  timestamp: string;
}

interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  orderNumber: string;
}

export const useChat = () => {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState<UserData>({ email: '', firstName: '', lastName: '', orderNumber: '' });
  const [isRegistered, setIsRegistered] = useState(false);
  const [isParticipating, setIsParticipating] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');
  const [isBotThinking, setIsBotThinking] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentQuestion = botQuestions[step];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const checkInvoiceExists = async (orderNumber: string) => {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .eq('invoice_number', orderNumber)
      .single();

    if (error && error.code !== 'PGRST116') return null;
    return data;
  };

  const handleNextQuestion = async () => {
    const updatedUserData = { ...userData, [currentQuestion.field]: newMessage };
    setUserData(updatedUserData);

    if (currentQuestion.isFinal) {
      await supabase.from('participants').upsert({
        email: updatedUserData.email,
        name: updatedUserData.firstName,
        invoice_number: updatedUserData.orderNumber,
        has_participated: true,
        created_at: new Date().toISOString(),
      });
      setIsParticipating(false);
      setAlertMessage('¡Gracias por participar en la trivia!');
      setIsBotThinking(false);
    } else {
      addBotMessage(botQuestions[step + 1].question, 1000);
      setStep((prev) => prev + 1);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: uuidv4(),
      username: 'User',
      text: newMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    await supabase
      .from('messages')
      .insert([{ text: newMessage, username: userData.email || 'User', timestamp: new Date().toISOString() }]);
    setNewMessage('');
    setIsBotThinking(true);

    if (step === 1) {
      setUserData({ ...userData, email: newMessage });
      setIsRegistered(true);
      setStep(2);
      addBotMessage(botQuestions[2].question, 1000);
    } else if (step === 2) {
      if (await checkInvoiceExists(newMessage)) {
        setAlertMessage('El número de factura ya existe, no puedes continuar.');
        setIsParticipating(false);
        setIsBotThinking(false);
        return;
      }
      setUserData({ ...userData, orderNumber: newMessage });
      await handleNextQuestion();
    } else {
      await handleNextQuestion();
    }
  };

  const addBotMessage = (text: string, delay: number) => {
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: uuidv4(), username: 'Bot', text, timestamp: new Date().toISOString() },
      ]);
      setIsBotThinking(false);
    }, delay);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([{ id: uuidv4(), username: 'Bot', text: '', timestamp: new Date().toISOString() }]);
    setTimeout(() => setIsBotThinking(true), 500);
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.username === 'Bot' ? { ...msg, text: botQuestions[0].question } : msg
        )
      );
      setIsBotThinking(false);
    }, 1500);
  }, []);

  return {
    messages,
    newMessage,
    isParticipating,
    alertMessage,
    isBotThinking,
    setNewMessage,
    handleSendMessage,
    messagesEndRef,
    setAlertMessage,
  };
};
