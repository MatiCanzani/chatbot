import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../supabaseClient';
import BotMessage from './BotMessage';
import Message from './Message';
import Alert from './Alert';
import { botQuestions } from '../utils/botQuestions';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

interface MessageData {
  id: string;
  username: string;
  text: string;
  timestamp: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    orderNumber: '',
  });
  const [isRegistered, setIsRegistered] = useState(false);
  const [isParticipating, setIsParticipating] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');
  const [isBotThinking, setIsBotThinking] = useState(false);
  const { setIsChatCompleted, currentQuestionIndex, questions } = useAppContext();


  const navigate = useNavigate(); // Hook for navigation

  const currentQuestion = botQuestions[step];
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const checkInvoiceExists = async (orderNumber: string) => {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .eq('invoice_number', orderNumber)
      .single();
    return error && error.code !== 'PGRST116' ? null : data;
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
    await supabase.from('messages').insert({
      text: newMessage,
      username: userData.email || 'User',
      timestamp: new Date().toISOString(),
    });

    setNewMessage('');
    setIsBotThinking(true);

    let botMessage: MessageData;

    if (step === 1) {
      setUserData({ ...userData, email: newMessage });
      setIsRegistered(true);
      setStep(2);
      botMessage = {
        id: uuidv4(),
        username: 'Bot',
        text: botQuestions[2].question,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setTimeout(() => setIsBotThinking(false), 500);
    } else {
      if (step === 2) {
        const invoiceExists = await checkInvoiceExists(newMessage);
        if (invoiceExists) {
          setAlertMessage('El número de factura ya existe, no puedes continuar.');
          setIsParticipating(false);
          setIsBotThinking(false);
          return;
        }
        setUserData({ ...userData, orderNumber: newMessage });
      }

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
        setAlertMessage('Te estamos redirigiendo...');
        setIsBotThinking(false);

        setIsChatCompleted(true);
        setTimeout(() => navigate('/trivia'), 1000);

      } else {
        botMessage = {
          id: uuidv4(),
          username: 'Bot',
          text: botQuestions[step + 1].question,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, botMessage]);
        setTimeout(() => setIsBotThinking(false), 800);
        setStep(step + 1);
      }
    }
  };

  useEffect(() => {
    setMessages([{ id: uuidv4(), username: 'Bot', text: '', timestamp: new Date().toISOString() }]);
    const spinnerTimer = setTimeout(() => setIsBotThinking(true), 500);
    const messageTimer = setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.username === 'Bot' ? { ...msg, text: botQuestions[0].question } : msg
        )
      );
      setIsBotThinking(false);
    }, 1500);

    return () => {
      clearTimeout(spinnerTimer);
      clearTimeout(messageTimer);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  return (
    <div className="h-[474px] flex flex-col min-w-full">
      <div className="flex-1 overflow-auto pr-4">
        {messages.map((msg, index) => {
          const isLastBotMessage = msg.username === 'Bot' && index === messages.length - 1;
          return msg.username === 'Bot' ? (
            <BotMessage key={msg.id} content={msg.text} isThinking={isLastBotMessage && isBotThinking} />
          ) : (
            <Message key={msg.id} content={msg.text} isYou={msg.username === 'User'} sender={msg.username} id={''} username={''} timestamp={''} />
          );
        })}
        {alertMessage && <Alert message={alertMessage} onClose={() => setAlertMessage('')} />}
        <div ref={messagesEndRef} />
      </div>
      {isParticipating && (
        <div className="flex items-center justify-center w-full space-x-2 mt-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleSendMessage}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium text-white bg-black hover:bg-[#111827E6] h-10 px-4 py-2"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default Chat;
