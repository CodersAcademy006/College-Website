import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiUser, FiMessageSquare } from 'react-icons/fi';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { RootState } from '@/store';
import {
  createSession,
  updateSession,
  fetchSessions
} from '../store/mentorshipSlice';
import { MentorshipSession } from '../types';
import { AppDispatch } from '@/store';

const SessionManager = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { sessions, loading, error } = useSelector(
    (state: RootState) => state.mentorship
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<MentorshipSession | null>(null);
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    notes: ''
  });

  const handleCreateSession = () => {
    if (selectedSession) {
      dispatch(
        updateSession({
          id: selectedSession.id,
          session: {
            ...selectedSession,
            date: new Date(formData.date),
            startTime: formData.startTime,
            endTime: formData.endTime,
            notes: formData.notes,
            status: 'scheduled'
          }
        })
      );
    } else {
      dispatch(
        createSession({
          date: new Date(formData.date),
          startTime: formData.startTime,
          endTime: formData.endTime,
          notes: formData.notes,
          status: 'scheduled',
          mentorId: 'current-user-id', // Replace with actual user ID
          menteeId: 'selected-mentee-id' // Replace with selected mentee ID
        })
      );
    }
    setIsModalOpen(false);
    setSelectedSession(null);
    setFormData({
      date: '',
      startTime: '',
      endTime: '',
      notes: ''
    });
  };

  const handleEditSession = (session: MentorshipSession) => {
    setSelectedSession(session);
    setFormData({
      date: session.date.toISOString().split('T')[0],
      startTime: session.startTime,
      endTime: session.endTime,
      notes: session.notes || ''
    });
    setIsModalOpen(true);
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Mentorship Sessions</h2>
        <Button onClick={() => setIsModalOpen(true)}>Schedule Session</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map((session) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <FiCalendar className="text-primary" />
                  <span>{session.date.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiClock className="text-primary" />
                  <span>
                    {session.startTime} - {session.endTime}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiUser className="text-primary" />
                  <span>Mentor: {session.mentorId}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiUser className="text-primary" />
                  <span>Mentee: {session.menteeId}</span>
                </div>
                {session.notes && (
                  <div className="flex items-start space-x-2">
                    <FiMessageSquare className="text-primary mt-1" />
                    <p className="text-sm text-gray-600">{session.notes}</p>
                  </div>
                )}
                <div className="flex justify-between items-center">
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
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEditSession(session)}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSession(null);
          setFormData({
            date: '',
            startTime: '',
            endTime: '',
            notes: ''
          });
        }}
        title={selectedSession ? 'Edit Session' : 'Schedule Session'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Time
            </label>
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) =>
                setFormData({ ...formData, startTime: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              End Time
            </label>
            <input
              type="time"
              value={formData.endTime}
              onChange={(e) =>
                setFormData({ ...formData, endTime: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedSession(null);
                setFormData({
                  date: '',
                  startTime: '',
                  endTime: '',
                  notes: ''
                });
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateSession}>
              {selectedSession ? 'Update' : 'Schedule'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SessionManager; 