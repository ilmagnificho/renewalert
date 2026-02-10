import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';

type BadgeVariant = 'danger' | 'warning' | 'success' | 'default';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className, variant = 'default', ...props }, ref) => {
        const variants = {
            danger: 'bg-danger-bg text-danger border-danger/20',
            warning: 'bg-warning-bg text-warning border-warning/20',
            success: 'bg-success-bg text-success border-success/20',
            default: 'bg-dark-hover text-text-secondary border-dark-border',
        };

        return (
            <span
                ref={ref}
                className={cn(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                    variants[variant],
                    className
                )}
                {...props}
            />
        );
    }
);

Badge.displayName = 'Badge';

export { Badge };
export type { BadgeProps, BadgeVariant };
