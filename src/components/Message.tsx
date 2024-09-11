import React from 'react';

export interface MessageProps {
  id: string | number;
  username: string;
  content: string;
  timestamp: string;
  isYou: boolean;
  sender: string;
}

const Message: React.FC<MessageProps> = ({ content, sender, timestamp, isYou }) => {
  return (
    <div className={`flex my-4 text-gray-600 text-sm ${isYou ? 'justify-end' : ''} w-full`}>
      <div className={`max-w-[60%] p-4 rounded-lg ${isYou ? 'bg-blue-100 text-right' : 'bg-gray-100 text-left'} shadow-md border`}>
        <span className="block font-bold text-gray-700">{sender}</span>
        <p className="leading-relaxed">{content}</p>
      </div>
    </div>
  );
};

export default Message;
