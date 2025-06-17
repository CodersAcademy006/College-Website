import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiUser, FiStar, FiCheck, FiX } from 'react-icons/fi';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { RootState } from '@/store';
import { AppDispatch } from '@/store';
import {
  fetchMatches,
  acceptMatch,
  rejectMatch
} from '../store/mentorshipSlice';
import { MentorshipMatch } from '../types';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const MatchManager = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { matches, loading, error } = useSelector(
    (state: RootState) => state.mentorship
  );

  useEffect(() => {
    dispatch(fetchMatches('current-user-id')); // Replace with actual user ID
  }, [dispatch]);

  const handleAcceptMatch = (matchId: string) => {
    dispatch(acceptMatch(matchId));
  };

  const handleRejectMatch = (matchId: string) => {
    dispatch(rejectMatch(matchId));
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
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Mentorship Matches</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.map((match) => (
          <motion.div key={`${match.mentorId}-${match.menteeId}`} variants={item}>
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FiUser className="text-primary" />
                    <span>Mentor: {match.mentorId}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiStar className="text-yellow-400" />
                    <span>{match.matchScore}% Match</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <FiUser className="text-primary" />
                  <span>Mentee: {match.menteeId}</span>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Common Interests:</h4>
                  <div className="flex flex-wrap gap-2">
                    {match.commonInterests.map((interest, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      match.status === 'accepted'
                        ? 'bg-green-100 text-green-800'
                        : match.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {match.status}
                  </span>

                  {match.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleRejectMatch(`${match.mentorId}-${match.menteeId}`)}
                      >
                        <FiX className="mr-1" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAcceptMatch(`${match.mentorId}-${match.menteeId}`)}
                      >
                        <FiCheck className="mr-1" />
                        Accept
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default MatchManager; 