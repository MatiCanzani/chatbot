import React from 'react';
import Spinner from './Spinner';

type BotMessageProps = {
  content: string;
  isThinking?: boolean;
};

const BotMessage: React.FC<BotMessageProps> = ({ content, isThinking }) => {
  return (
    <div className="flex my-4 text-gray-600 text-sm w-full justify-start">
      <div className="min-w-[60%] max-w-[85%] min-h-[62px] px-2.5 py-2 rounded-lg bg-gray-100 text-left shadow-md border">
        <span className="block font-bold text-gray-700">Bot</span>
        {isThinking ? (

          <div className='py-1.5'>
            <div className="flex justify-center">
              <Spinner />
            </div>
          </div>
        ) : (
          <p className="leading-relaxed">{content}</p>
        )}
      </div>
    </div>
  );
};

export default BotMessage;
