import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { FiBook, FiUsers, FiClock, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi'
import { RootState, AppDispatch } from '@/store'
import { fetchCourses, deleteCourse, Course } from '@/store/slices/coursesSlice'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { toast } from 'react-hot-toast'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function Courses() {
  const dispatch = useDispatch<AppDispatch>()
  const { courses, loading } = useSelector((state: RootState) => state.courses)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  useEffect(() => {
    dispatch(fetchCourses())
  }, [dispatch])

  const filteredCourses = courses.filter((course: Course) =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async () => {
    if (selectedCourse) {
      try {
        await dispatch(deleteCourse(selectedCourse.id))
        toast.success('Course deleted successfully')
        setIsDeleteModalOpen(false)
      } catch (error) {
        toast.error('Failed to delete course')
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
        <Button
          onClick={() => {/* TODO: Implement add course */}}
          className="flex items-center space-x-2"
        >
          <FiPlus className="w-5 h-5" />
          <span>Add Course</span>
        </Button>
      </div>

      <div className="w-full md:w-96">
        <Input
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          icon={<FiBook className="w-5 h-5 text-gray-400" />}
        />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredCourses.map((course: Course) => (
          <motion.div
            key={course.id}
            variants={item}
            className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {/* TODO: Implement edit course */}}
                    className="text-primary hover:text-primary-dark"
                  >
                    <FiEdit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCourse(course)
                      setIsDeleteModalOpen(true)
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <FiUsers className="w-4 h-4 mr-1" />
                  <span>{course.students} students</span>
                </div>
                <div className="flex items-center">
                  <FiClock className="w-4 h-4 mr-1" />
                  <span>{course.duration}</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">
                  {course.instructor}
                </span>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    course.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {course.status}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Course"
      >
        <div className="p-6">
          <p className="text-gray-600">
            Are you sure you want to delete {selectedCourse?.name}? This action cannot be undone.
          </p>
          <div className="mt-6 flex justify-end space-x-4">
            <Button
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
} 