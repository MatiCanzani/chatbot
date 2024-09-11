import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import ChatBot from './components/Chat';
import TriviaForm from './components/Trivia';
import { AppProvider } from './context/AppProvider';
import ChatLayout from './layout/ChatLayout';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 flex flex-col">
          <div className="flex-grow flex items-center justify-center">
            <ChatLayout>
              <Routes>
                <Route path="/" element={<ChatBot />} />
                <Route path="/trivia" element={<ProtectedRoute element={<TriviaForm />} />} />
              </Routes>
            </ChatLayout>
          </div>
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;
