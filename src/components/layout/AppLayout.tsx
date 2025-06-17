import { ReactNode } from 'react'
import { useAppSelector } from '@/store'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

interface AppLayoutProps {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { sidebarOpen } = useAppSelector((state) => state.ui)

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div
        className={`flex flex-col transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        <TopBar />
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
} 