import React, { ReactNode } from 'react';
import { CloseIcon } from './Icons';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div 
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full ${sizeClasses[size]} flex flex-col transform transition-all duration-300 ease-in-out scale-95 animate-scale-in`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg p-1.5">
                        <CloseIcon />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto max-h-[80vh]">
                    {children}
                </div>
            </div>
            {/* FIX: Removed non-standard 'jsx' attribute from style tag to resolve TypeScript error. */}
            <style>{`
                @keyframes scale-in {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-scale-in {
                    animation: scale-in 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default Modal;