import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiClock, FiPlus, FiTrash2 } from 'react-icons/fi';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { RootState } from '@/store';
import { AppDispatch } from '@/store';
import { updateMentorAvailability } from '../store/mentorshipSlice';
import { Availability } from '../types';

const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

const AvailabilityManager = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { mentors, loading, error } = useSelector(
    (state: RootState) => state.mentorship
  );
  const currentUserId = 'current-user-id'; // Replace with actual user ID
  const currentMentor = mentors.find((m) => m.id === currentUserId);

  const [availability, setAvailability] = useState<Availability[]>(
    currentMentor?.availability || []
  );

  const handleAddTimeSlot = () => {
    setAvailability([
      ...availability,
      { day: 'Monday', startTime: '09:00', endTime: '10:00' }
    ]);
  };

  const handleRemoveTimeSlot = (index: number) => {
    setAvailability(availability.filter((_, i) => i !== index));
  };

  const handleUpdateTimeSlot = (
    index: number,
    field: keyof Availability,
    value: string
  ) => {
    const updatedAvailability = [...availability];
    updatedAvailability[index] = {
      ...updatedAvailability[index],
      [field]: value
    };
    setAvailability(updatedAvailability);
  };

  const handleSaveAvailability = () => {
    dispatch(
      updateMentorAvailability({
        id: currentUserId,
        availability
      })
    );
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
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Manage Availability</h2>
          <Button onClick={handleAddTimeSlot}>
            <FiPlus className="mr-2" />
            Add Time Slot
          </Button>
        </div>

        <div className="space-y-4">
          {availability.map((slot, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex-1 grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Day
                  </label>
                  <select
                    value={slot.day}
                    onChange={(e) =>
                      handleUpdateTimeSlot(index, 'day', e.target.value)
                    }
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  >
                    {daysOfWeek.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={slot.startTime}
                    onChange={(e) =>
                      handleUpdateTimeSlot(index, 'startTime', e.target.value)
                    }
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={slot.endTime}
                    onChange={(e) =>
                      handleUpdateTimeSlot(index, 'endTime', e.target.value)
                    }
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleRemoveTimeSlot(index)}
                className="self-end"
              >
                <FiTrash2 />
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSaveAvailability}>Save Availability</Button>
        </div>
      </div>
    </Card>
  );
};

export default AvailabilityManager; 