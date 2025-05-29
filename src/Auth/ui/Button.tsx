import React from 'react';

interface ButtonProps {
    children: React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary';
    size?: 'sm' | 'md' | 'lg';
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    className?: string;
    fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    children,
    type = 'button',
    variant = 'primary',
    size = 'md',
    onClick,
    className = '',
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
            bg-greenColor text-white hover:bg-greenColor
            shadow-sm hover:shadow-md
        `,
    };

    // Size styles
    const sizeStyles = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base'
    };

    return (
        <button
            type={type}
            onClick={onClick}
            className={`
                ${baseStyles}
                ${variantStyles[variant]}
                ${sizeStyles[size]}
                ${className}
            `}
            {...props}
        >

            {/* Button Content */}
            {children}
        </button>
    );
};

export default Button;