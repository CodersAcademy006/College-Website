import { forwardRef, SelectHTMLAttributes, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  icon?: ReactNode
  error?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, icon, error, children, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <select
          ref={ref}
          className={twMerge(
            'block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm',
            icon && 'pl-10',
            error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        >
          {children}
        </select>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

export default Select 