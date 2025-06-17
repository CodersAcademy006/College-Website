import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiUsers, FiMessageSquare, FiCalendar, FiStar } from 'react-icons/fi';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { RootState } from '@/store';
import {
  fetchMentors,
  fetchMentees,
  fetchSessions,
  fetchMatches
} from '../store/mentorshipSlice';

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

const MentorshipDashboard = () => {
  const dispatch = useDispatch();
  const { mentors, mentees, sessions, matches, loading, error } = useSelector(
    (state: RootState) => state.mentorship
  );

  useEffect(() => {
    dispatch(fetchMentors());
    dispatch(fetchMentees());
    dispatch(fetchSessions('current-user-id')); // Replace with actual user ID
    dispatch(fetchMatches('current-user-id')); // Replace with actual user ID
  }, [dispatch]);

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={item}>
          <Card className="p-4">
            <div className="flex items-center space-x-4">
              <FiUsers className="text-2xl text-primary" />
              <div>
                <h3 className="text-lg font-semibold">Mentors</h3>
                <p className="text-2xl font-bold">{mentors.length}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="p-4">
            <div className="flex items-center space-x-4">
              <FiUsers className="text-2xl text-primary" />
              <div>
                <h3 className="text-lg font-semibold">Mentees</h3>
                <p className="text-2xl font-bold">{mentees.length}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="p-4">
            <div className="flex items-center space-x-4">
              <FiCalendar className="text-2xl text-primary" />
              <div>
                <h3 className="text-lg font-semibold">Sessions</h3>
                <p className="text-2xl font-bold">{sessions.length}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="p-4">
            <div className="flex items-center space-x-4">
              <FiStar className="text-2xl text-primary" />
              <div>
                <h3 className="text-lg font-semibold">Matches</h3>
                <p className="text-2xl font-bold">{matches.length}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={item}>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Sessions</h2>
            <div className="space-y-4">
              {sessions.slice(0, 5).map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      {session.mentorId} - {session.menteeId}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(session.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      session.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : session.status === 'scheduled'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {session.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Matches</h2>
            <div className="space-y-4">
              {matches.slice(0, 5).map((match) => (
                <div
                  key={`${match.mentorId}-${match.menteeId}`}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      Match Score: {match.matchScore}%
                    </p>
                    <p className="text-sm text-gray-500">
                      {match.commonInterests.join(', ')}
                    </p>
                  </div>
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
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MentorshipDashboard; 