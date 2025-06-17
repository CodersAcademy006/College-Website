import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiPaperclip, FiMonitor } from 'react-icons/fi';
import { ChatMessage } from '../types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface ChatWindowProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  onSendFile: (file: File) => void;
  onStartScreenShare: () => void;
  otherUser: {
    id: string;
    name: string;
    photo?: string;
    isOnline: boolean;
  };
}

const ChatWindow = ({
  messages,
  onSendMessage,
  onSendFile,
  onStartScreenShare,
  otherUser,
}: ChatWindowProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSendFile(file);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="h-[600px] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={otherUser.photo || '/default-avatar.png'}
              alt={otherUser.name}
              className="w-10 h-10 rounded-full"
            />
            <div
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                otherUser.isOnline ? 'bg-green-500' : 'bg-gray-400'
              }`}
            />
          </div>
          <div>
            <h3 className="font-medium">{otherUser.name}</h3>
            <p className="text-sm text-gray-500">
              {otherUser.isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={onStartScreenShare}
          className="flex items-center space-x-2"
        >
          <FiMonitor className="w-4 h-4" />
          <span>Share Screen</span>
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${
                message.senderId === otherUser.id ? 'justify-start' : 'justify-end'
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.senderId === otherUser.id
                    ? 'bg-gray-100'
                    : 'bg-primary text-white'
                }`}
              >
                <p>{message.content}</p>
                <div
                  className={`text-xs mt-1 ${
                    message.senderId === otherUser.id
                      ? 'text-gray-500'
                      : 'text-primary-100'
                  }`}
                >
                  {formatTime(message.timestamp)}
                  {message.status === 'read' && (
                    <span className="ml-2">✓✓</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <FiPaperclip className="w-4 h-4" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" variant="primary" size="sm">
            <FiSend className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ChatWindow; 