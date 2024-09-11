import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import BotMessage from './BotMessage';
import Message from './Message';
import Alert from './Alert';
import { botQuestions } from '../utils/questions';
import { v4 as uuidv4 } from 'uuid';

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
  const [showSpinner, setShowSpinner] = useState(false); 

  const currentQuestion = botQuestions[step];

  const checkInvoiceExists = async (orderNumber: string) => {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .eq('invoice_number', orderNumber)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking invoice:', error);
      return null;
    }

    return data;
  };

  const fetchMessages = async (email: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('username', email)
      .order('timestamp', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }

    setMessages(data as MessageData[]);
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    setShowSpinner(true);
    setTimeout(async () => {
      if (step === 1) {
        setUserData({ ...userData, email: newMessage });
        setIsRegistered(true);
        setStep(2);
        setMessages((prevMessages) => [
          ...prevMessages,
          { id: uuidv4(), username: 'Bot', text: botQuestions[2].question, timestamp: new Date().toISOString() }
        ]);
        setNewMessage('');
        setShowSpinner(false);
        return;
      }

      if (step === 2) {
        const invoiceExists = await checkInvoiceExists(newMessage);
        if (invoiceExists) {
          setAlertMessage('El número de factura ya existe, no puedes continuar.');
          setIsParticipating(false);
          setShowSpinner(false); 
          return;
        }
        setUserData({ ...userData, orderNumber: newMessage });
      }

      const updatedUserData = { ...userData, [currentQuestion.field]: newMessage };
      setUserData(updatedUserData);

      await supabase.from('messages').insert([
        { text: newMessage, username: userData.email || 'User', timestamp: new Date().toISOString() }
      ]);

      setMessages((prevMessages) => [
        ...prevMessages,
        { id: uuidv4(), username: 'User', text: newMessage, timestamp: new Date().toISOString() }
      ]);

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
      } else {
        setStep(step + 1);
        setMessages((prevMessages) => [
          ...prevMessages,
          { id: uuidv4(), username: 'Bot', text: botQuestions[step + 1].question, timestamp: new Date().toISOString() }
        ]);
      }

      setNewMessage('');
      setShowSpinner(false); 
    }, 800);
  };

  useEffect(() => {
    setMessages([
      {
        id: uuidv4(), 
        username: 'Bot',
        text: botQuestions[0].question,
        timestamp: new Date().toISOString(),
      }
    ]);
  }, []);

  return (
    <div className="h-[474px] flex flex-col" style={{ minWidth: '100%' }}>
      <div className="flex-1 overflow-auto pr-4">
        {messages.map((msg, index) => (
          <React.Fragment key={msg.id}>
            {index > 0 && (
              <div className="flex justify-center my-2">
                {showSpinner && index === messages.length - 1 && (
                  <div className="flex items-center justify-center space-x-1">
                    <div className="w-2.5 h-2.5 bg-gray-600 rounded-full animate-dot-flashing"></div>
                    <div className="w-2.5 h-2.5 bg-gray-600 rounded-full animate-dot-flashing delay-200"></div>
                    <div className="w-2.5 h-2.5 bg-gray-600 rounded-full animate-dot-flashing delay-400"></div>
                  </div>
                )}
              </div>
            )}
            {msg.username === 'Bot'
              ? <BotMessage key={msg.id} content={msg.text} />
              : <Message content={msg.text} isYou={msg.username === 'User'} sender={msg.username} key={msg.id} {...msg} />
            }
          </React.Fragment>
        ))}
        {alertMessage && <Alert message={alertMessage} onClose={() => setAlertMessage('')} />}
      </div>
      {isParticipating && (
        <div className="flex items-center justify-center w-full space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleSendMessage}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium text-white disabled:pointer-events-none disabled:opacity-50 bg-black hover:bg-[#111827E6] h-10 px-4 py-2"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default Chat;
