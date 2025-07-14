import React from 'react';

interface BiddingSkeletonProps {
    isMobile?: boolean;
}

const BidLoading: React.FC<BiddingSkeletonProps> = ({ isMobile = false }) => {
    // Skeleton component for individual elements
    const Skeleton = ({ className = "", variant = "default" }: { className?: string; variant?: "default" | "circular" | "text" }) => {
        const baseClasses = "animate-pulse bg-gray-200";
        const variantClasses = {
            default: "rounded-md",
            circular: "rounded-full",
            text: "rounded"
        };

        return <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} />;
    };

    // Product Details Skeleton
    const ProductDetailsSkeleton = () => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-2 space-y-4">
            {/* Header */}
            <div className="border-b border-gray-300 pb-14">
            </div>

            {/* Product Image */}
            <div className="aspect-video w-full mb-4 h-64">
                <Skeleton className="w-full h-64" />
            </div>

            {/* Product Title */}
            <div className="space-y-2">
                <Skeleton className="h-8 w-3/4" variant="text" />
                <Skeleton className="h-6 w-1/2" variant="text" />
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-20" variant="text" />
                    <Skeleton className="h-6 w-24" variant="text" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-20" variant="text" />
                    <Skeleton className="h-6 w-24" variant="text" />
                </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Skeleton className="h-4 w-20" variant="text" />
                <Skeleton className="h-4 w-full" variant="text" />
                <Skeleton className="h-4 w-4/5" variant="text" />
                <Skeleton className="h-4 w-3/5" variant="text" />
            </div>
        </div>
    );

    // Bid History Skeleton
    const BidHistorySkeleton = () => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-300">
            {/* Header */}
            <div className="p-4 border-b border-gray-300">
                {/* Status and Timer */}
                <div className="flex justify-between items-center mb-4">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-20" variant="text" />
                </div>
            </div>

            {/* Bid Items */}
            <div className="p-4 space-y-3">
                {[...Array(5)].map((_, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Skeleton className="h-10 w-10" variant="circular" />
                        <div className="flex-1 space-y-1">
                            <div className="flex justify-between items-center">
                                <Skeleton className="h-4 w-24" variant="text" />
                                <Skeleton className="h-5 w-20" variant="text" />
                            </div>
                            <Skeleton className="h-3 w-16" variant="text" />
                        </div>
                        <div className="text-right space-y-1">
                            <Skeleton className="h-4 w-12" variant="text" />
                            <Skeleton className="h-3 w-16" variant="text" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // Bid Placement Skeleton
    const BidPlacementSkeleton = () => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-2 space-y-4">
            {/* Header */}
            <div className="text-center space-y-2">
                <Skeleton className="h-6 w-32 mx-auto" variant="text" />
                <Skeleton className="h-8 w-24 mx-auto" variant="text" />
            </div>

            {/* Current Bid Info */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" variant="text" />
                    <Skeleton className="h-4 w-16" variant="text" />
                </div>
                <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" variant="text" />
                    <Skeleton className="h-4 w-20" variant="text" />
                </div>
            </div>

            {/* Bid Input */}
            <div className="space-y-3">
                <Skeleton className="h-4 w-16" variant="text" />
                <Skeleton className="h-12 w-full" />

                {/* Quick Bid Buttons */}
                <div className="grid grid-cols-3 gap-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </div>
            </div>

            {/* Auto Bid Toggle */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <Skeleton className="h-4 w-20" variant="text" />
                <Skeleton className="h-6 w-12" />
            </div>

            {/* Submit Button */}
            <Skeleton className="h-12 w-full" />
        </div>
    );

    // Mobile Layout
    if (isMobile) {
        return (
            <div className="min-h-screen">
                <div className="max-w-9xl mx-auto px-4 py-6">
                    <div className="space-y-4">
                        <ProductDetailsSkeleton />
                        <BidHistorySkeleton />
                        <BidPlacementSkeleton />
                    </div>
                </div>
            </div>
        );
    }

    // Desktop Layout
    return (
        <div className="min-h-screen">
            <div className="max-w-9xl mx-auto px-4 py-6">
                <div className="grid grid-cols-3 gap-4">
                    {/* Left Column - Product Details */}
                    <div className="col-span-2">
                        <div className="space-y-4">
                            <ProductDetailsSkeleton />
                            <BidHistorySkeleton />
                        </div>
                    </div>

                    {/* Right Column - Bid Placement */}
                    <div className="col-span-1">
                        <BidPlacementSkeleton />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BidLoading;