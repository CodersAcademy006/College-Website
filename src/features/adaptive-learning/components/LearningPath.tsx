import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiBook, FiClock, FiTrendingUp } from 'react-icons/fi';
import { RootState, AppDispatch } from '@/store';
import { 
  fetchLearningPath, 
  fetchCourseRecommendations, 
  fetchMaterialRecommendations 
} from '../store/adaptiveLearningSlice';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { CourseRecommendation, MaterialRecommendation } from '../types';

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

export default function LearningPath() {
  const dispatch = useDispatch<AppDispatch>();
  const { learningPath, courseRecommendations, materialRecommendations, loading, error } = 
    useSelector((state: RootState) => state.adaptiveLearning);

  useEffect(() => {
    const studentId = 'current-user-id'; // Replace with actual user ID
    dispatch(fetchLearningPath(studentId));
    dispatch(fetchCourseRecommendations(studentId));
    dispatch(fetchMaterialRecommendations(studentId));
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
      <div className="text-red-600 text-center p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Your Learning Path</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Progress:</span>
          <div className="w-32 h-2 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-primary rounded-full"
              style={{ width: `${learningPath?.progress || 0}%` }}
            />
          </div>
          <span className="text-sm font-medium">{learningPath?.progress || 0}%</span>
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Course Recommendations */}
        <motion.div variants={item}>
          <Card title="Recommended Courses">
            <div className="space-y-4">
              {courseRecommendations.map((course: CourseRecommendation) => (
                <div
                  key={course.courseId}
                  className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
                      <p className="text-gray-600 mt-1">{course.description}</p>
                    </div>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-800">
                      {course.difficulty}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <FiClock className="w-4 h-4 mr-1" />
                      <span>{course.estimatedDuration}</span>
                    </div>
                    <div className="flex items-center">
                      <FiTrendingUp className="w-4 h-4 mr-1" />
                      <span>{course.matchScore}% match</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Material Recommendations */}
        <motion.div variants={item}>
          <Card title="Recommended Materials">
            <div className="space-y-4">
              {materialRecommendations.map((material: MaterialRecommendation) => (
                <div
                  key={material.id}
                  className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{material.title}</h3>
                      <p className="text-gray-600 mt-1">{material.type}</p>
                    </div>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-800">
                      {material.difficulty}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {material.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => window.open(material.url, '_blank')}
                    >
                      View Material
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
} 