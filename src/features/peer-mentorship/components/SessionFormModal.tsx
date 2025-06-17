import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

interface SessionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (sessionData: {
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    agenda: string;
  }) => void;
  mentorName: string;
}

const SessionFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  mentorName,
}: SessionFormModalProps) => {
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    agenda: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Schedule Session with ${mentorName}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <Input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <Input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <Input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <Input
            type="text"
            name="location"
            placeholder="Enter Zoom link or meeting location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Agenda
          </label>
          <textarea
            name="agenda"
            value={formData.agenda}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            rows={4}
            placeholder="What topics would you like to discuss?"
            required
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Send Invite
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default SessionFormModal; 