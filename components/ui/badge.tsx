import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';

type BadgeVariant = 'danger' | 'warning' | 'success' | 'default' | 'secondary' | 'outline' | 'destructive';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className, variant = 'default', ...props }, ref) => {
        const variants = {
            danger: 'bg-danger-bg text-danger border-danger/20',
            warning: 'bg-warning-bg text-warning border-warning/20',
            success: 'bg-green-500/10 text-green-500 border-green-500/20',
            default: 'bg-zinc-800 text-zinc-300 border-zinc-700',
            secondary: 'bg-zinc-800 text-zinc-300 hover:bg-zinc-800/80',
            outline: 'text-zinc-300 border-zinc-700',
            destructive: 'bg-red-500/10 text-red-500 border-red-500/20',
        };

        return (
            <span
                ref={ref}
                className={
                    cn(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                        variants[variant],
                        className
                    )
                }
                {...props}
            />
        );
    }
);

Badge.displayName = 'Badge';

export { Badge };
export type { BadgeProps, BadgeVariant };
