import './App.css';
import ChatBot from './components/Chat';
import { AppProvider } from './context/AppProvider';
import ChatLayout from './layout/ChatLayout';

const App = () => {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <ChatLayout>
          <ChatBot />
        </ChatLayout>
      </div>
    </AppProvider>
  );
};

export default App;
