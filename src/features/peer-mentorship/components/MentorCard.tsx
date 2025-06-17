import { motion } from 'framer-motion';
import { FiStar, FiClock, FiMessageSquare } from 'react-icons/fi';
import { Mentor } from '../types';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface MentorCardProps {
  mentor: Mentor;
  onRequestSession: (mentorId: string) => void;
}

const MentorCard = ({ mentor, onRequestSession }: MentorCardProps) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <FiStar
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Card className="p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-start space-x-4">
          <div className="relative">
            <img
              src={mentor.photo || '/default-avatar.png'}
              alt={mentor.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{mentor.name}</h3>
            <p className="text-sm text-gray-600">{mentor.course}</p>
            <div className="flex items-center mt-1">
              {renderStars(mentor.rating)}
              <span className="ml-2 text-sm text-gray-600">
                ({mentor.rating.toFixed(1)})
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {mentor.expertise.map((skill) => (
              <span
                key={skill}
                className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">{mentor.bio}</p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <FiClock className="w-4 h-4 mr-1" />
              <span>{mentor.availability.length} slots</span>
            </div>
            <div className="flex items-center">
              <FiMessageSquare className="w-4 h-4 mr-1" />
              <span>Chat</span>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onRequestSession(mentor.id)}
          >
            Request Session
          </Button>
        </div>
      </motion.div>
    </Card>
  );
};

export default MentorCard; 