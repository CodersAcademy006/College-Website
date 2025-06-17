import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';

interface FormProps<T extends z.ZodType> {
  schema: T;
  onSubmit: (data: z.infer<T>) => void;
  children: React.ReactNode;
  className?: string;
  defaultValues?: Partial<z.infer<T>>;
}

interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  className?: string;
  error?: string;
}

const FormField = ({
  name,
  label,
  type = 'text',
  placeholder,
  className,
  error,
  ...props
}: FormFieldProps) => {
  return (
    <div className={twMerge('space-y-1', className)}>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        className={twMerge(
          'block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm',
          error && 'border-red-300 focus:border-red-500 focus:ring-red-500'
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

const FormSelect = ({
  name,
  label,
  options,
  className,
  error,
  ...props
}: FormFieldProps & { options: { value: string; label: string }[] }) => {
  return (
    <div className={twMerge('space-y-1', className)}>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <select
        id={name}
        className={twMerge(
          'block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm',
          error && 'border-red-300 focus:border-red-500 focus:ring-red-500'
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

const FormTextarea = ({
  name,
  label,
  placeholder,
  className,
  error,
  ...props
}: FormFieldProps) => {
  return (
    <div className={twMerge('space-y-1', className)}>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <textarea
        id={name}
        placeholder={placeholder}
        className={twMerge(
          'block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm',
          error && 'border-red-300 focus:border-red-500 focus:ring-red-500'
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

function Form<T extends z.ZodType>({
  schema,
  onSubmit,
  children,
  className,
  defaultValues,
}: FormProps<T>) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={twMerge('space-y-4', className)}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === FormField) {
          const { name } = child.props;
          return (
            <Controller
              name={name}
              control={control}
              render={({ field }) =>
                React.cloneElement(child, {
                  ...field,
                  error: errors[name]?.message,
                })
              }
            />
          );
        }
        return child;
      })}
    </form>
  );
}

Form.Field = FormField;
Form.Select = FormSelect;
Form.Textarea = FormTextarea;

export default Form; 