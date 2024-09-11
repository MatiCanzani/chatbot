import React from 'react';
import { useAppContext } from '../layout/AppContext';
import Message from './Message';

const Messages: React.FC = () => {
  const { username, loadingInitial, error, getMessagesAndSubscribe, messages } = useAppContext();
  const reversedMessages = [...messages].reverse();

  if (loadingInitial) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin border-t-2 border-b-2 border-gray-900 w-8 h-8 mx-auto rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-800 p-4 mb-4 rounded border border-red-300">
        <p>{error}</p>
        <button
          onClick={getMessagesAndSubscribe}
          className="text-red-600 hover:underline mt-2"
        >
          Try to reconnect
        </button>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <h3 className="text-center py-4">No messages 😞</h3>
    );
  }

  return (
    <div className="flex flex-col-reverse">
      {reversedMessages.map((message) => {
        const isYou = message.username === username;
        return (
          <Message
            key={message.id}
            id={message.id}
            username={message.username}
            content={message.content}
            timestamp={message.timestamp}
            isYou={isYou}
            sender={message.username}
          />
        );
      })}
    </div>
  );
};

export default Messages;
