import React from 'react';

// Card Component Props Interface
export interface CardProps {
    className?: string;
    children?: React.ReactNode;
    onClick?: () => void;
    hover?: boolean;
    shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
    padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export interface CardHeaderProps {
    className?: string;
    children?: React.ReactNode;
}

export interface CardBodyProps {
    className?: string;
    children?: React.ReactNode;
}

export interface CardFooterProps {
    className?: string;
    children?: React.ReactNode;
}

export interface CardTitleProps {
    className?: string;
    children?: React.ReactNode;
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export interface CardDescriptionProps {
    className?: string;
    children?: React.ReactNode;
}

// Main Card Component
const Card: React.FC<CardProps> = ({
    className = '',
    children,
    onClick,
    hover = false,
    shadow = 'md',
    rounded = 'lg',
    padding = 'md',
}) => {
    const baseClasses = 'bg-white border border-gray-200';

    const shadowClasses = {
        none: '',
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg',
        xl: 'shadow-xl',
    };

    const roundedClasses = {
        none: '',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full',
    };

    const paddingClasses = {
        none: '',
        sm: 'p-2',
        md: 'p-4',
        lg: 'p-6',
        xl: 'p-8',
    };

    const hoverClasses = hover ? 'hover:shadow-lg transition-shadow duration-200 cursor-pointer' : '';
    const clickableClasses = onClick ? 'cursor-pointer' : '';

    const cardClasses = [
        baseClasses,
        shadowClasses[shadow],
        roundedClasses[rounded],
        paddingClasses[padding],
        hoverClasses,
        clickableClasses,
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={cardClasses} onClick={onClick}>
            {children}
        </div>
    );
};

// Card Header Component
const CardHeader: React.FC<CardHeaderProps> = ({ className = '', children }) => {
    return (
        <div className={`mb-4 ${className}`}>
            {children}
        </div>
    );
};

// Card Body Component
const CardBody: React.FC<CardBodyProps> = ({ className = '', children }) => {
    return (
        <div className={`flex-1 ${className}`}>
            {children}
        </div>
    );
};

// Card Footer Component
const CardFooter: React.FC<CardFooterProps> = ({ className = '', children }) => {
    return (
        <div className={`mt-4 pt-4 border-t border-gray-200 ${className}`}>
            {children}
        </div>
    );
};

// Card Title Component
const CardTitle: React.FC<CardTitleProps> = ({
    className = '',
    children,
    as: Component = 'h3'
}) => {
    const titleClasses = `font-semibold text-gray-900 ${className}`;

    return (
        <Component className={titleClasses}>
            {children}
        </Component>
    );
};

// Card Description Component
const CardDescription: React.FC<CardDescriptionProps> = ({ className = '', children }) => {
    return (
        <p className={`text-gray-600 text-sm ${className}`}>
            {children}
        </p>
    );
};

// Export all components
export default Card;
export { CardHeader, CardBody, CardFooter, CardTitle, CardDescription };

// Example usage component
export const ProductCard: React.FC<{
    product: {
        _id: string;
        name: string;
        description: string;
        images: string[];
        startingPrice: number;
        currentHighestBid: number;
        productStatus: string;
        quantity: {
            value: number;
            unit: string;
        };
    };
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    onView?: (id: string) => void;
}> = ({ product, onEdit, onDelete, onView }) => {
    return (
        <Card hover shadow="md" className="w-full max-w-sm">
            <CardHeader>
                {product.images && product.images.length > 0 && (
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-md mb-3"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                        }}
                    />
                )}
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                    {product.description}
                </CardDescription>
            </CardHeader>

            <CardBody>
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Starting Price:</span>
                        <span className="font-medium">₹{product.startingPrice}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Current Bid:</span>
                        <span className="font-medium text-green-600">₹{product.currentHighestBid}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Quantity:</span>
                        <span className="font-medium">{product.quantity.value} {product.quantity.unit}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.productStatus === 'ACTIVE'
                                ? 'bg-green-100 text-green-800'
                                : product.productStatus === 'SOLD'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-red-100 text-red-800'
                            }`}>
                            {product.productStatus}
                        </span>
                    </div>
                </div>
            </CardBody>

            <CardFooter>
                <div className="flex justify-between gap-2">
                    {onView && (
                        <button
                            onClick={() => onView(product._id)}
                            className="flex-1 px-3 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                        >
                            View
                        </button>
                    )}
                    {onEdit && (
                        <button
                            onClick={() => onEdit(product._id)}
                            className="flex-1 px-3 py-2 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                        >
                            Edit
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={() => onDelete(product._id)}
                            className="flex-1 px-3 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                        >
                            Delete
                        </button>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
};