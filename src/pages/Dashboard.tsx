import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { FiUsers, FiBook, FiCalendar, FiTrendingUp } from 'react-icons/fi'
import { Chart } from '@/components/ui/Chart'
import { Card } from '@/components/ui/Card'
import { RootState } from '@/store'
import { fetchDashboardStats } from '@/store/slices/dashboardSlice'

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

export default function Dashboard() {
  const dispatch = useDispatch()
  const { stats, loading } = useSelector((state: RootState) => state.dashboard)

  useEffect(() => {
    dispatch(fetchDashboardStats())
  }, [dispatch])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 p-6"
    >
      <motion.h1 variants={item} className="text-3xl font-bold text-gray-900">
        Dashboard
      </motion.h1>

      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card
          title="Total Students"
          value={stats.totalStudents}
          icon={<FiUsers className="w-6 h-6 text-primary" />}
          trend={stats.studentGrowth}
        />
        <Card
          title="Total Courses"
          value={stats.totalCourses}
          icon={<FiBook className="w-6 h-6 text-primary" />}
          trend={stats.courseGrowth}
        />
        <Card
          title="Attendance Rate"
          value={`${stats.attendanceRate}%`}
          icon={<FiCalendar className="w-6 h-6 text-primary" />}
          trend={stats.attendanceGrowth}
        />
        <Card
          title="Performance"
          value={`${stats.performanceRate}%`}
          icon={<FiTrendingUp className="w-6 h-6 text-primary" />}
          trend={stats.performanceGrowth}
        />
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Student Enrollment Trends">
          <Chart
            type="line"
            data={stats.enrollmentData}
            height={300}
            className="bg-white p-4 rounded-lg"
          />
        </Card>
        <Card title="Course Distribution">
          <Chart
            type="doughnut"
            data={stats.courseDistribution}
            height={300}
            className="bg-white p-4 rounded-lg"
          />
        </Card>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Recent Activities" className="lg:col-span-2">
          <div className="space-y-4">
            {stats.recentActivities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
              >
                <div className={`p-2 rounded-full ${activity.iconBg}`}>
                  {activity.icon}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
        <Card title="Quick Actions">
          <div className="space-y-4">
            {stats.quickActions.map((action, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-4 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {action.icon}
                  <span className="font-medium text-gray-900">{action.title}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )
} 