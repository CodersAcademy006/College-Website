import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiMessageSquare, FiCalendar, FiClock } from 'react-icons/fi';
import MentorshipDashboard from '../components/MentorshipDashboard';
import SessionManager from '../components/SessionManager';
import MatchManager from '../components/MatchManager';
import Chat from '../components/Chat';
import AvailabilityManager from '../components/AvailabilityManager';

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: FiUsers },
  { id: 'sessions', label: 'Sessions', icon: FiCalendar },
  { id: 'matches', label: 'Matches', icon: FiUsers },
  { id: 'chat', label: 'Chat', icon: FiMessageSquare },
  { id: 'availability', label: 'Availability', icon: FiClock }
];

const MentorshipPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedChatUser, setSelectedChatUser] = useState<string | null>(null);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <MentorshipDashboard />;
      case 'sessions':
        return <SessionManager />;
      case 'matches':
        return <MatchManager />;
      case 'chat':
        return selectedChatUser ? (
          <Chat otherUserId={selectedChatUser} />
        ) : (
          <div className="text-center text-gray-500">
            <p>Select a user to start chatting</p>
          </div>
        );
      case 'availability':
        return <AvailabilityManager />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-2 border-b">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
      >
        {renderContent()}
      </motion.div>
    </div>
  );
};

export default MentorshipPage; 