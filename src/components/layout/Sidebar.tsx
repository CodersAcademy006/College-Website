import { Link, useLocation } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '@/store'
import { toggleSidebar } from '@/store/slices/uiSlice'
import { UserRole } from '@/contexts/AuthContext'
import {
  FiHome,
  FiUsers,
  FiBook,
  FiCalendar,
  FiBarChart2,
  FiSettings,
  FiMenu,
} from 'react-icons/fi'

interface NavItem {
  label: string
  path: string
  icon: React.ReactNode
  roles: UserRole[]
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: <FiHome className="h-5 w-5" />,
    roles: ['admin', 'teacher', 'student'],
  },
  {
    label: 'Students',
    path: '/students',
    icon: <FiUsers className="h-5 w-5" />,
    roles: ['admin', 'teacher'],
  },
  {
    label: 'Courses',
    path: '/courses',
    icon: <FiBook className="h-5 w-5" />,
    roles: ['admin', 'teacher', 'student'],
  },
  {
    label: 'Attendance',
    path: '/attendance',
    icon: <FiCalendar className="h-5 w-5" />,
    roles: ['admin', 'teacher'],
  },
  {
    label: 'Analytics',
    path: '/analytics',
    icon: <FiBarChart2 className="h-5 w-5" />,
    roles: ['admin'],
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: <FiSettings className="h-5 w-5" />,
    roles: ['admin', 'teacher', 'student'],
  },
]

export default function Sidebar() {
  const dispatch = useAppDispatch()
  const { sidebarOpen } = useAppSelector((state) => state.ui)
  const { user } = useAppSelector((state) => state.auth)
  const location = useLocation()

  if (!user) return null

  const filteredNavItems = navItems.filter((item) => item.roles.includes(user.role))

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen w-64 transform bg-white shadow-lg transition-transform duration-300 dark:bg-gray-800 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-primary">College CMS</span>
        </Link>
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <FiMenu className="h-6 w-6" />
        </button>
      </div>

      <nav className="mt-4 space-y-1 px-2">
        {filteredNavItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path)
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="absolute bottom-0 w-full border-t border-gray-200 p-4 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-primary text-white">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
          </div>
        </div>
      </div>
    </aside>
  )
} 