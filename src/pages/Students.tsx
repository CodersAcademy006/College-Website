import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiFilter, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi'
import { RootState } from '@/store'
import { fetchStudents, deleteStudent } from '@/store/slices/studentsSlice'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { toast } from 'react-hot-toast'

export default function Students() {
  const dispatch = useDispatch()
  const { students, loading } = useSelector((state: RootState) => state.students)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<any>(null)

  useEffect(() => {
    dispatch(fetchStudents())
  }, [dispatch])

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCourse = !selectedCourse || student.course === selectedCourse
    return matchesSearch && matchesCourse
  })

  const handleDelete = async () => {
    if (selectedStudent) {
      try {
        await dispatch(deleteStudent(selectedStudent.id))
        toast.success('Student deleted successfully')
        setIsDeleteModalOpen(false)
      } catch (error) {
        toast.error('Failed to delete student')
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
        <h1 className="text-3xl font-bold text-gray-900">Students</h1>
        <Button
          onClick={() => {/* TODO: Implement add student */}}
          className="flex items-center space-x-2"
        >
          <FiPlus className="w-5 h-5" />
          <span>Add Student</span>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<FiSearch className="w-5 h-5 text-gray-400" />}
          />
        </div>
        <div className="w-full md:w-64">
          <Select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            icon={<FiFilter className="w-5 h-5 text-gray-400" />}
          >
            <option value="">All Courses</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Physics">Physics</option>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {filteredStudents.map((student) => (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          {student.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {student.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.course}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          student.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {/* TODO: Implement edit student */}}
                        className="text-primary hover:text-primary-dark mr-4"
                      >
                        <FiEdit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedStudent(student)
                          setIsDeleteModalOpen(true)
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Student"
      >
        <div className="p-6">
          <p className="text-gray-600">
            Are you sure you want to delete {selectedStudent?.name}? This action cannot be undone.
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