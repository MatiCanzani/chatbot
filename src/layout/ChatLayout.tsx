import React from 'react';
import { Header } from './Header';

const ChatLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-white">
      <div
        style={{ boxShadow: '0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0 0 0 / 0.05)' }}
        className="bg-white rounded-lg border border-[#e5e7eb] w-full max-w-[440px] h-full max-h-[634px] flex flex-col"
      >
        <Header />
        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ChatLayout;
