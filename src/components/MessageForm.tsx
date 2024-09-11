import { useState } from 'react';
import { BiSend } from 'react-icons/bi';
import { useAppContext } from '../layout/AppContext';
import { supabase } from '../../supabaseClient';

const MessageForm: React.FC = () => {
  const { username, country, session } = useAppContext();
  const [message, setMessage] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    if (!message) return;

    setMessage('');

    try {
      const { error } = await supabase.from('messages').insert([
        {
          text: message,
          username,
          country,
          is_authenticated: session ? true : false,
        },
      ]);

      if (error) {
        console.error(error.message);
        alert(`Error sending: ${error.message}`);
        return;
      }
      console.log('Successfully sent!');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="py-2.5 pt-3.5 bg-gray-100">
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="flex">
            <input
              name="message"
              placeholder="Enter a message"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              className="flex-1 bg-white border-none px-4 py-2 rounded-l-lg shadow-sm focus:outline-none"
              autoFocus
              maxLength={500}
            />
            <button
              aria-label="Send"
              type="submit"
              disabled={!message || isSending}
              className="bg-teal-500 text-white p-2 rounded-r-lg flex items-center justify-center hover:bg-teal-600 disabled:opacity-50"
              style={{ fontSize: '20px' }}
            >
              <BiSend />
            </button>
          </div>
        </form>
        <div className="text-xs mt-2 text-gray-500">
          Warning: do not share any sensitive information, it's a public chat room 🙂
        </div>
      </div>
    </div>
  );
};

export default MessageForm;
