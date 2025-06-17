import { motion } from 'framer-motion';
import { FiTarget, FiUser } from 'react-icons/fi';
import { Mentee } from '../types';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface MenteeCardProps {
  mentee: Mentee;
  onAssignMentor: (menteeId: string) => void;
}

const MenteeCard = ({ mentee, onAssignMentor }: MenteeCardProps) => {
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
              src={mentee.photo || '/default-avatar.png'}
              alt={mentee.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{mentee.name}</h3>
            <p className="text-sm text-gray-600">{mentee.course}</p>
            {mentee.currentMentor && (
              <div className="flex items-center mt-1 text-sm text-gray-600">
                <FiUser className="w-4 h-4 mr-1" />
                <span>Mentor: {mentee.currentMentor.name}</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <FiTarget className="w-4 h-4 mr-2" />
            <span className="font-medium">Learning Goals:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {mentee.goals.map((goal) => (
              <span
                key={goal}
                className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full"
              >
                {goal}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-sm text-gray-600">
            Status: <span className="capitalize">{mentee.status}</span>
          </div>
          {!mentee.currentMentor && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onAssignMentor(mentee.id)}
            >
              Assign Mentor
            </Button>
          )}
        </div>
      </motion.div>
    </Card>
  );
};

export default MenteeCard; 