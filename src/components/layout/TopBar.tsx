import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { useAppSelector, useAppDispatch } from '@/store'
import { toggleSidebar, toggleTheme } from '@/store/slices/uiSlice'
import { logout } from '@/store/slices/authSlice'
import { FiMenu, FiSun, FiMoon, FiUser, FiLogOut } from 'react-icons/fi'

export default function TopBar() {
  const dispatch = useAppDispatch()
  const { theme } = useAppSelector((state) => state.ui)
  const { user } = useAppSelector((state) => state.auth)

  if (!user) return null

  return (
    <header className="sticky top-0 z-30 h-16 bg-white shadow-sm dark:bg-gray-800">
      <div className="flex h-full items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FiMenu className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            College CMS
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => dispatch(toggleTheme())}
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {theme === 'light' ? (
              <FiMoon className="h-5 w-5" />
            ) : (
              <FiSun className="h-5 w-5" />
            )}
          </button>

          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center space-x-2 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
              <div className="h-8 w-8 rounded-full bg-primary text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {user.name}
              </span>
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex w-full items-center space-x-2 px-4 py-2 text-sm ${
                        active
                          ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <FiUser className="h-4 w-4" />
                      <span>Profile</span>
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => dispatch(logout())}
                      className={`flex w-full items-center space-x-2 px-4 py-2 text-sm ${
                        active
                          ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <FiLogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </header>
  )
} 