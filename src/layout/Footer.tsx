import { FaGithub, FaTwitter } from 'react-icons/fa';
import MessageForm from '../components/MessageForm';

export default function Footer() {
  return (
    <div className="fixed bottom-0 w-full bg-white">
      <MessageForm />

      <div className="flex items-center justify-between py-1 px-8 h-10">
        <a
          href="https://twitter.com/shwosner"
          target="_blank"
          rel="noreferrer"
          className="flex items-center text-gray-700 hover:text-gray-900"
        >
          <FaTwitter className="mr-2" />
          @shwosner
        </a>

        <a
          href="https://github.com/shwosner/realtime-chat-supabase-react"
          target="_blank"
          rel="noreferrer"
          className="flex items-center text-gray-700 hover:text-gray-900"
        >
          <FaGithub className="mr-2" />
          Source code
        </a>
      </div>
    </div>
  );
}
