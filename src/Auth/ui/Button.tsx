import React from 'react';

interface ButtonProps {
    children: React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    className?: string;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    children,
    type = 'button',
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    onClick,
    className = '',
    icon,
    iconPosition = 'left',
    fullWidth = false,
    ...props
}) => {
    // Base styles
    const baseStyles = `
        inline-flex items-center justify-center font-medium rounded-lg
        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-60 disabled:cursor-not-allowed
        ${fullWidth ? 'w-full' : ''}
    `;

    // Variant styles
    const variantStyles = {
        primary: `
            bg-green-600 text-white hover:bg-green-700 
            focus:ring-green-500 shadow-sm hover:shadow-md
        `,
        secondary: `
            bg-gray-600 text-white hover:bg-gray-700 
            focus:ring-gray-500 shadow-sm hover:shadow-md
        `,
        outline: `
            border-2 border-green-600 text-green-600 bg-transparent 
            hover:bg-green-600 hover:text-white focus:ring-green-500
        `,
        ghost: `
            text-green-600 bg-transparent hover:bg-green-50 
            focus:ring-green-500
        `,
        danger: `
            bg-red-600 text-white hover:bg-red-700 
            focus:ring-red-500 shadow-sm hover:shadow-md
        `
    };

    // Size styles
    const sizeStyles = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base'
    };

    // Loading spinner
    const LoadingSpinner = () => (
        <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    );

    return (
        <button
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            className={`
                ${baseStyles}
                ${variantStyles[variant]}
                ${sizeStyles[size]}
                ${className}
            `}
            {...props}
        >
            {/* Loading State */}
            {loading && <LoadingSpinner />}
            
            {/* Left Icon */}
            {icon && iconPosition === 'left' && !loading && (
                <span className={`${children ? 'mr-2' : ''}`}>
                    {icon}
                </span>
            )}
            
            {/* Button Content */}
            {children}
            
            {/* Right Icon */}
            {icon && iconPosition === 'right' && !loading && (
                <span className={`${children ? 'ml-2' : ''}`}>
                    {icon}
                </span>
            )}
        </button>
    );
};

export default Button;