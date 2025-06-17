import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiUser } from 'react-icons/fi';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { RootState } from '@/store';
import { AppDispatch } from '@/store';
import {
  fetchMessages,
  sendMessage
} from '../store/mentorshipSlice';
import { ChatMessage } from '../types';

interface ChatProps {
  otherUserId: string;
}

const Chat = ({ otherUserId }: ChatProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { messages, loading, error } = useSelector(
    (state: RootState) => state.mentorship
  );
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = 'current-user-id'; // Replace with actual user ID

  useEffect(() => {
    dispatch(fetchMessages({ userId: currentUserId, otherUserId }));
  }, [dispatch, currentUserId, otherUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      dispatch(
        sendMessage({
          senderId: currentUserId,
          receiverId: otherUserId,
          content: newMessage.trim()
        })
      );
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${
                message.senderId === currentUserId ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.senderId === currentUserId
                    ? 'bg-primary text-white'
                    : 'bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <FiUser className="text-sm" />
                  <span className="text-sm font-medium">
                    {message.senderId === currentUserId ? 'You' : 'Mentor'}
                  </span>
                </div>
                <p className="text-sm">{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4">
        <div className="flex space-x-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 rounded-lg border border-gray-300 p-2 focus:border-primary focus:ring-1 focus:ring-primary resize-none"
            rows={2}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="self-end"
          >
            <FiSend />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default Chat; 