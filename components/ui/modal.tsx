'use client';

import { cn } from '@/lib/utils';
import { useEffect, useCallback } from 'react';
import { Button } from './button';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
}

export function Modal({ isOpen, onClose, title, children, footer, size = 'md' }: ModalProps) {
    const handleEsc = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        },
        [onClose]
    );

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleEsc]);

    if (!isOpen) return null;

    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />
            {/* Content */}
            <div
                className={cn(
                    'relative w-full mx-4 bg-dark-card border border-dark-border rounded-xl shadow-2xl animate-scale-in',
                    sizes[size]
                )}
            >
                {title && (
                    <div className="flex items-center justify-between p-5 border-b border-dark-border">
                        <h2 className="text-lg font-semibold">{title}</h2>
                        <button
                            onClick={onClose}
                            className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}
                <div className="p-5">{children}</div>
                {footer && (
                    <div className="flex items-center justify-end gap-3 p-5 border-t border-dark-border">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}

// Confirm Modal shortcut
interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    isLoading?: boolean;
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = '확인',
    isLoading,
}: ConfirmModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            footer={
                <>
                    <Button variant="ghost" onClick={onClose}>
                        취소
                    </Button>
                    <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>
                        {confirmText}
                    </Button>
                </>
            }
        >
            <p className="text-text-secondary">{message}</p>
        </Modal>
    );
}
