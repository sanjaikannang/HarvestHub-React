import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'glass' | 'bordered';
}

const Card: React.FC<CardProps> = ({
    children,
    className = '',
    variant = 'default'
}) => {
    const baseClasses = 'rounded-2xl p-8';

    const variantClasses = {
        default: 'bg-white shadow-xl',
        glass: 'bg-white/80 backdrop-blur-sm shadow-xl border border-white/20',
        bordered: 'bg-white border border-gray-200 shadow-sm'
    };

    const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

    return (
        <div className={classes}>
            {children}
        </div>
    );
};

export default Card;