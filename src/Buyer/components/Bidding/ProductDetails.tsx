import { useState } from "react";
import {
    Users,
    Package,
    ChevronUp,
    ChevronDown,
    Weight,
    IndianRupee,
    MoveHorizontal,
} from "lucide-react";

interface ProductResponse {
    _id: string;
    name: string;
    description: string;
    farmerId: string;
    quantity: {
        value: number;
        unit: string;
    };
    images: string[];
    startingPrice: number;
    currentHighestBid: number;
    bidStartDate: Date;
    bidEndDate: Date;
    bidStartTime: Date;
    bidEndTime: Date;
    productStatus: string;
}

interface ProductDetailsProps {
    product: ProductResponse;
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
    const [isProductDetailsOpen, setIsProductDetailsOpen] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const toggleProductDetails = () => {
        setIsProductDetailsOpen(!isProductDetailsOpen);
    };

    const nextImage = () => {
        if (product.images.length > 1) {
            setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
        }
    };

    const prevImage = () => {
        if (product.images.length > 1) {
            setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
        }
    };

    // Default image if no images are provided
    const defaultImage = "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80";
    const displayImage = product.images && product.images.length > 0 ? product.images[currentImageIndex] : defaultImage;

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div
                className="p-4 border-b border-gray-200 cursor-pointer"
                onClick={toggleProductDetails}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {product.name}
                        </h2>
                    </div>
                    <button
                        className="flex items-center justify-center w-8 h-8 cursor-pointer"
                        aria-label={
                            isProductDetailsOpen
                                ? "Collapse product details"
                                : "Expand product details"
                        }
                    >
                        {isProductDetailsOpen ? (
                            <ChevronUp className="h-5 w-5 text-gray-500" />
                        ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                        )}
                    </button>
                </div>
            </div>

            {/* Product Content - Collapsible */}
            <div
                className={`transition-all duration-300 ease-in-out ${isProductDetailsOpen
                    ? "max-h-full opacity-100"
                    : "max-h-0 opacity-0 overflow-hidden"
                    }`}
            >
                {/* Image Section */}
                <div className="relative aspect-w-16 aspect-h-9">
                    <img
                        src={displayImage}
                        alt={product.name}
                        className="w-full h-64 object-cover"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = defaultImage;
                        }}
                    />

                    {/* Image Navigation */}
                    {product.images && product.images.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                            >
                                <ChevronUp className="h-4 w-4 rotate-[-90deg]" />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                            >
                                <ChevronUp className="h-4 w-4 rotate-90" />
                            </button>

                            {/* Image Indicators */}
                            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                                {product.images.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                                            }`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <div className="p-4">
                    <p className="text-gray-600 mb-6">{product.description}</p>

                    {/* Price Information */}
                    <div className="bg-gray-50 rounded-lg border border-gray-300 p-2 mb-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                            {/* Starting Price */}
                            <div className="border-r border-gray-300">
                                <div className="flex items-center justify-around mb-2">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-medium text-gray-600">Starting Price</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center space-x-1">
                                    <IndianRupee className="w-4 h-4 text-blue-600" />
                                    <p className="text-2xl font-bold text-blue-600">
                                        {product?.startingPrice?.toLocaleString('en-IN') || '0'}
                                    </p>
                                    <span className="text-sm text-gray-500">/-</span>
                                </div>
                            </div>

                            {/* Current Highest Bid */}
                            <div className="border-r border-gray-300">
                                <div className="flex items-center justify-around mb-2">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-medium text-gray-600">Highest Bid</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center space-x-1">
                                    <IndianRupee className="w-4 h-4 text-green-600" />
                                    <p className="text-2xl font-bold text-green-600">
                                        {product?.currentHighestBid?.toLocaleString('en-IN') || '0'}
                                    </p>
                                    <span className="text-sm text-gray-500">/-</span>
                                </div>
                            </div>

                            <div className="border-r border-gray-300">
                                <div className="flex items-center justify-around mb-2">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-medium text-gray-600">Quantity</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center space-x-1">
                                    <Weight className="w-4 h-4 text-green-600" />
                                    <p className="text-2xl font-bold text-green-600">
                                        {product.quantity.value} {product.quantity.unit}
                                    </p>
                                </div>
                            </div>

                            {/* Status with Verified Stamp */}
                            <div>
                                <div className="flex items-center justify-center">
                                    <div className="relative">
                                        <img
                                            src="/stamp/verified_stamp.png"
                                            alt="Verified Stamp"
                                            className="w-15 h-15 object-contain"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 border border-gray-300 rounded-lg p-2">
                        <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                                Farmer ID: <strong>{product.farmerId}</strong>
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Package className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                                Product ID: <strong>{product._id}</strong>
                            </span>
                        </div>
                    </div>


                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Start Date and End Date  */}
                        <div className="bg-gray-50 border border-gray-300 rounded-lg p-2">
                            <h3 className="text-center text-sm font-medium text-gray-800 mb-2">Bidding Date's</h3>
                            <div className="border-t border-gray-300">
                                <div className="mt-2">
                                    <div className="grid grid-cols-2">
                                        <div className="text-center">
                                            <div className="text-[10px] text-gray-500 font-medium mb-0.2">Start Date</div>
                                        </div>

                                        <div className="text-center">
                                            <div className="text-[10px] text-gray-500 font-medium mb-0.2">End Date</div>
                                        </div>
                                    </div>

                                    {/* Time Slots with Move Horizontal Icon */}
                                    <div className="grid grid-cols-2 relative">
                                        <div className="text-center">
                                            <div className="bg-white border-l border-t border-b border-gray-300 rounded-l-md py-1">
                                                <span className="text-sm font-bold text-green-600">
                                                    {new Date(product.bidStartDate).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Move Horizontal Icon */}
                                        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                                            <MoveHorizontal className="w-6 h-6 text-gray-400" />
                                        </div>

                                        <div className="text-center">
                                            <div className="bg-white border-r border-t border-b border-gray-300 rounded-r-md py-1">
                                                <span className="text-sm font-bold text-red-600">
                                                    {new Date(product.bidEndDate).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* Bidding Timeline */}
                        <div className="bg-gray-50 border border-gray-300 rounded-lg p-2">
                            <h3 className="text-center text-sm font-medium text-gray-800 mb-2">Bidding Timeline</h3>
                            <div className="border-t border-gray-300">
                                <div className="flex justify-center items-center gap-2 mb-2 mt-2">
                                    <span className="text-sm font-semibold text-gray-700">
                                        {new Date(product.bidStartDate).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2">
                                    <div className="text-center">
                                        <div className="text-[10px] text-gray-500 font-medium mb-0.2">Start Time</div>
                                    </div>

                                    <div className="text-center">
                                        <div className="text-[10px] text-gray-500 font-medium mb-0.2">End Time</div>
                                    </div>
                                </div>

                                {/* Time Slots with Move Horizontal Icon */}
                                <div className="grid grid-cols-2 relative">
                                    <div className="text-center">
                                        <div className="bg-white border-l border-t border-b border-gray-300 rounded-l-md py-1">
                                            <span className="text-sm font-bold text-green-600">
                                                {new Date(product.bidStartTime).toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: true
                                                })}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Move Horizontal Icon */}
                                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                                        <MoveHorizontal className="w-6 h-6 text-gray-400" />
                                    </div>

                                    <div className="text-center">
                                        <div className="bg-white border-r border-t border-b border-gray-300 rounded-r-md py-1">
                                            <span className="text-sm font-bold text-red-600">
                                                {new Date(product.bidEndTime).toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: true
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProductDetails;