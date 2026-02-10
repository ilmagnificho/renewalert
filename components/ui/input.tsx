'use client';

import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, helperText, id, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1.5">
                {label && (
                    <label htmlFor={id} className="text-sm font-medium text-text-secondary">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={id}
                    className={cn(
                        'h-10 w-full rounded-lg bg-dark-card border border-dark-border px-3 text-sm text-text-primary placeholder:text-text-tertiary transition-colors duration-200',
                        'focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        error && 'border-danger focus:border-danger focus:ring-danger',
                        className
                    )}
                    {...props}
                />
                {error && <p className="text-xs text-danger">{error}</p>}
                {helperText && !error && <p className="text-xs text-text-tertiary">{helperText}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';

// Select
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, error, options, id, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1.5">
                {label && (
                    <label htmlFor={id} className="text-sm font-medium text-text-secondary">
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    id={id}
                    className={cn(
                        'h-10 w-full rounded-lg bg-dark-card border border-dark-border px-3 text-sm text-text-primary transition-colors duration-200 appearance-none cursor-pointer',
                        'focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        error && 'border-danger focus:border-danger focus:ring-danger',
                        className
                    )}
                    {...props}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                {error && <p className="text-xs text-danger">{error}</p>}
            </div>
        );
    }
);

Select.displayName = 'Select';

// Textarea
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, error, id, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1.5">
                {label && (
                    <label htmlFor={id} className="text-sm font-medium text-text-secondary">
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={id}
                    className={cn(
                        'w-full rounded-lg bg-dark-card border border-dark-border p-3 text-sm text-text-primary placeholder:text-text-tertiary transition-colors duration-200 resize-none min-h-[80px]',
                        'focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        error && 'border-danger focus:border-danger focus:ring-danger',
                        className
                    )}
                    {...props}
                />
                {error && <p className="text-xs text-danger">{error}</p>}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';

export { Input, Select, Textarea };
export type { InputProps, SelectProps, TextareaProps };
