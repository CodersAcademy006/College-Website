import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi'
import { twMerge } from 'tailwind-merge'

interface CardProps {
  title?: string
  value?: string | number
  icon?: ReactNode
  trend?: number
  children?: ReactNode
  className?: string
}

const Card = ({ title, value, icon, trend, children, className = '' }: CardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={twMerge(
        'bg-white rounded-lg shadow-sm p-6',
        className
      )}
    >
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      )}
      {children ? (
        children
      ) : (
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
            {trend !== undefined && (
              <div className="mt-2 flex items-center">
                {trend >= 0 ? (
                  <FiTrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <FiTrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span
                  className={`ml-2 text-sm font-medium ${
                    trend >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {Math.abs(trend)}%
                </span>
                <span className="ml-2 text-sm text-gray-500">vs last month</span>
              </div>
            )}
          </div>
          {icon && <div className="p-3 bg-gray-50 rounded-lg">{icon}</div>}
        </div>
      )}
    </motion.div>
  )
}

export default Card 