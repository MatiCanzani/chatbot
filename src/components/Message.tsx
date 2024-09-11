// src/components/Message.tsx
import React from 'react';

export interface MessageProps {
  id: string| number;
  username: string;
  content: string;
  timestamp: string;
  isYou: boolean;
  sender: string;
}

const Message: React.FC<MessageProps> = ({ content, sender, timestamp, isYou }) => {

  return (
    // <div className={`flex flex-col mb-2 ${isYou ? 'text-right' : 'text-left'}`}>
    //   <span className="font-bold">{sender}</span>
    //   <span>{content}</span>
    //   {/* <span className="text-sm text-gray-500">{timestamp}</span> */}
    // </div>

    <div className="flex gap-3 my-4 text-gray-600 text-sm flex-1"><span
      className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
      <div className="rounded-full bg-gray-100 border p-1"><svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-user"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" /><path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" /></svg></div>
    </span>
      <p className="leading-relaxed"><span className="block font-bold text-gray-700">{sender} </span>{content}</p>
    </div>
  );
};

export default Message;