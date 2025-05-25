import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
    error?: string;
    showIcon?: boolean;
    className?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
    label,
    error,
    showIcon = true,
    className = '',
    id,
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || `password-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className={className}>
            {label && (
                <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                </label>
            )}
            <div className="relative">
                {showIcon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                )}
                <input
                    id={inputId}
                    type={showPassword ? "text" : "password"}
                    className={`block w-full ${showIcon ? 'pl-10' : 'pl-3'} pr-12 py-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500' : 'focus:ring-green-500'} focus:border-transparent transition-all duration-200 bg-white/50 ${props.disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    {...props}
                />
                <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors duration-200" />
                    ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors duration-200" />
                    )}
                </button>
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};

export default PasswordInput;