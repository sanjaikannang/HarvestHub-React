import React from "react";
import { LucideIcon } from "lucide-react";

type CardSize = "sm" | "md" | "lg";
type StatusType = "sold" | "active" | "inactive" | "pending" | "featured" | "new";
type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

interface CardData {
    title?: string;
    subtitle?: string;
    description?: string;
    price?: string | number;
    originalPrice?: string | number;
    tags?: string[];
    metadata?: { label: string; value: string | number }[];
}

interface CardButton {
    label: string;
    onClick: () => void;
    variant?: ButtonVariant;
    disabled?: boolean;
    icon?: LucideIcon;
    loading?: boolean;
}

interface CardProps {

    // Skeleton mode
    skeleton?: boolean;

    // Image props
    image?: string;
    imageAlt?: string;
    imageHeight?: string;

    // Status badge
    status?: StatusType | string;
    statusColor?: string;

    // Card data
    data?: CardData;

    // Buttons
    primaryButton?: CardButton;
    secondaryButton?: CardButton;

    // Card styling
    size?: CardSize;
    className?: string;
    shadow?: boolean;
    hover?: boolean;
    rounded?: boolean;

    // Events
    onCardClick?: () => void;

    // Custom content
    children?: React.ReactNode;
    customHeader?: React.ReactNode;
    customFooter?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
    skeleton = false,
    image,
    imageAlt = "Card image",
    imageHeight = "200px",
    status,
    statusColor,
    data,
    primaryButton,
    secondaryButton,
    size = "md",
    className = "",
    shadow = true,
    hover = true,
    rounded = true,
    onCardClick,
    children,
    customHeader,
    customFooter,
}) => {
    // Size configurations
    const sizeConfig = {
        sm: {
            padding: "p-2",
            spacing: "space-y-2",
            title: "text-sm font-semibold",
            subtitle: "text-xs text-gray-600",
            description: "text-xs text-gray-500",
            price: "text-sm font-bold",
            originalPrice: "text-xs text-gray-400 line-through",
            button: "px-3 py-1.5 text-xs",
            status: "px-2 py-1 text-[10px]",
        },
        md: {
            padding: "p-2",
            spacing: "space-y-3",
            title: "text-base font-semibold",
            subtitle: "text-sm text-gray-600",
            description: "text-sm text-gray-500",
            price: "text-lg font-bold",
            originalPrice: "text-sm text-gray-400 line-through",
            button: "px-4 py-2 text-sm",
            status: "px-2 py-0.5 text-[10px]",
        },
        lg: {
            padding: "p-2",
            spacing: "space-y-4",
            title: "text-lg font-semibold",
            subtitle: "text-base text-gray-600",
            description: "text-base text-gray-500",
            price: "text-xl font-bold",
            originalPrice: "text-base text-gray-400 line-through",
            button: "px-6 py-3 text-base",
            status: "px-3 py-1.5 text-sm",
        },
    };

    // Status color mapping
    const statusColors: Record<StatusType, string> = {
        sold: "bg-red-100 text-red-800 border-red-200",
        active: "bg-green-100 text-green-800 border-green-200",
        inactive: "bg-gray-100 text-gray-800 border-gray-200",
        pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
        featured: "bg-purple-100 text-purple-800 border-purple-200",
        new: "bg-blue-100 text-blue-800 border-blue-200",
    };

    // Button variant styles
    const buttonVariants: Record<ButtonVariant, string> = {
        primary: "bg-greenColor text-white hover:bg-green-600 cursor-pointer",
        secondary: "bg-gray-600 text-white hover:bg-gray-600 cursor-pointer",
        outline: "border-2 border-greenColor text-greenColor hover:bg-greenColor hover:text-white cursor-pointer",
        ghost: "text-greenColor hover:bg-green-50 cursor-pointer",
    };

    // Get status styling
    const getStatusClasses = () => {
        if (!status) return "";

        const baseClasses = `inline-flex items-center font-medium rounded-full border ${sizeConfig[size].status}`;
        const colorClasses = statusColor || statusColors[status as StatusType] || statusColors.active;

        return `${baseClasses} ${colorClasses}`;
    };

    // Get button classes
    const getButtonClasses = (variant: ButtonVariant = "primary") => {
        const baseClasses = `inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${sizeConfig[size].button}`;
        return `${baseClasses} ${buttonVariants[variant]}`;
    };

    // Get card classes
    const getCardClasses = () => {
        const baseClasses = `bg-white border border-gray-200 overflow-hidden ${sizeConfig[size].padding}`;
        const shadowClasses = shadow ? "shadow-sm hover:shadow-md" : "";
        const hoverClasses = hover && !skeleton ? "transition-all duration-200" : "";
        const roundedClasses = rounded ? "rounded-lg" : "";
        const clickableClasses = onCardClick && !skeleton ? "cursor-pointer" : "";
        const skeletonClasses = skeleton ? "animate-pulse" : "";

        return `${baseClasses} ${shadowClasses} ${hoverClasses} ${roundedClasses} ${clickableClasses} ${skeletonClasses} ${className}`;
    };

    // Render skeleton version
    if (skeleton) {
        return (
            <div className={getCardClasses()}>
                {/* Image Skeleton */}
                <div className="w-full bg-gray-200 rounded-lg mb-4" style={{ height: imageHeight }}></div>

                {/* Content Skeleton */}
                <div className={sizeConfig[size].spacing}>
                    {/* Status Badge Skeleton */}
                    <div className="mb-2">
                        <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
                    </div>

                    {/* Title Skeleton */}
                    <div className="mb-2">
                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-1"></div>
                        <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                    </div>

                    {/* Price Skeleton */}
                    <div className="mb-4">
                        <div className="h-6 bg-gray-200 rounded w-20"></div>
                    </div>

                    {/* Button Skeleton */}
                    <div className="h-8 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div
            className={getCardClasses()}
            onClick={onCardClick}
        >
            {/* Custom Header */}
            {customHeader}

            {/* Image Section */}
            {image && (
                <div className="relative mb-4">
                    <img
                        src={image}
                        alt={imageAlt}
                        className="w-full object-cover rounded-lg"
                        style={{ height: imageHeight }}
                    />

                    {/* Status Badge - Top Right */}
                    {status && (
                        <div className="absolute top-2 right-2">
                            <span className={getStatusClasses()}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* Card Content */}
            <div className={sizeConfig[size].spacing}>
                {/* Title and Subtitle */}
                {(data?.title || data?.subtitle) && (
                    <div>
                        {data.title && (
                            <h3 className={sizeConfig[size].title}>{data.title}</h3>
                        )}
                        {data.subtitle && (
                            <p className={sizeConfig[size].subtitle}>{data.subtitle}</p>
                        )}
                    </div>
                )}

                {/* Description */}
                {data?.description && (
                    <p className={sizeConfig[size].description}>{data.description}</p>
                )}

                {/* Price Section */}
                {(data?.price || data?.originalPrice) && (
                    <div className="flex items-center space-x-2">
                        {data.price && (
                            <span className={`${sizeConfig[size].price} text-greenColor`}>
                                {typeof data.price === 'number' ? `₹${data.price.toLocaleString()}` : data.price}
                            </span>
                        )}
                        {data.originalPrice && (
                            <span className={sizeConfig[size].originalPrice}>
                                {typeof data.originalPrice === 'number' ? `₹${data.originalPrice.toLocaleString()}` : data.originalPrice}
                            </span>
                        )}
                    </div>
                )}

                {/* Tags */}
                {data?.tags && data.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {data.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Metadata */}
                {data?.metadata && data.metadata.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                        {data.metadata.map((item, index) => (
                            <div key={index} className="text-sm">
                                <span className="text-gray-500">{item.label}: </span>
                                <span className="font-medium">{item.value}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Custom Children Content */}
                {children}

                {/* Buttons */}
                {(primaryButton || secondaryButton) && (
                    <div className="flex space-x-2">
                        {primaryButton && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    primaryButton.onClick();
                                }}
                                disabled={primaryButton.disabled || primaryButton.loading}
                                className={`${getButtonClasses(primaryButton.variant)} ${primaryButton.disabled || primaryButton.loading
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                    } flex-1`}
                            >
                                {primaryButton.loading ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                ) : primaryButton.icon ? (
                                    <primaryButton.icon className="w-4 h-4 mr-2" />
                                ) : null}
                                {primaryButton.label}
                            </button>
                        )}
                        {secondaryButton && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    secondaryButton.onClick();
                                }}
                                disabled={secondaryButton.disabled || secondaryButton.loading}
                                className={`${getButtonClasses(secondaryButton.variant)} ${secondaryButton.disabled || secondaryButton.loading
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                    } flex-1`}
                            >
                                {secondaryButton.loading ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                                ) : secondaryButton.icon ? (
                                    <secondaryButton.icon className="w-4 h-4 mr-2" />
                                ) : null}
                                {secondaryButton.label}
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Custom Footer */}
            {customFooter}
        </div>
    );
};

export default Card;