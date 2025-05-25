import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    className?: string;
}

const Input: React.FC<InputProps> = ({
    label,
    error,
    icon,
    className = '',
    id,
    ...props
}) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className={className}>
            {label && (
                <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {icon}
                    </div>
                )}
                <input
                    id={inputId}
                    className={`block w-full ${icon ? 'pl-10' : 'pl-3'} pr-3 py-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500' : 'focus:ring-green-500'} focus:border-transparent transition-all duration-200 bg-white/50 ${props.disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};

export default Input;