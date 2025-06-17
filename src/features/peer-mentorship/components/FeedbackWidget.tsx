import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiX } from 'react-icons/fi';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface FeedbackWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: {
    rating: number;
    comment: string;
    sessionId: string;
  }) => void;
  sessionId: string;
  mentorName: string;
}

const FeedbackWidget = ({
  isOpen,
  onClose,
  onSubmit,
  sessionId,
  mentorName,
}: FeedbackWidgetProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      rating,
      comment,
      sessionId,
    });
    setRating(0);
    setComment('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Feedback for ${mentorName}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How would you rate this session?
          </label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none"
              >
                <FiStar
                  className={`w-8 h-8 ${
                    star <= (hoveredRating || rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Comments
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            rows={4}
            placeholder="What went well? What could be improved?"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={rating === 0}
          >
            Submit Feedback
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default FeedbackWidget; 