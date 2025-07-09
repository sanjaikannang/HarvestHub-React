import { useState } from "react";
import {
    Package,
    ChevronUp,
    ChevronDown,
    MoveHorizontal,
    User,
    ArrowRightFromLine,
    ArrowLeftFromLine,
} from "lucide-react";
import { formatDate, formatTime } from "../../../utils/dateTime/dateFormatter";

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
    bidStartDate: string;
    bidEndDate: string;
    bidStartTime: string;
    bidEndTime: string;
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

    const displayImage = product.images && product.images.length > 0 ? product.images[currentImageIndex] : "";

    return (
        <>
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
                    <div className="w-full">
                        <img
                            src={displayImage}
                            alt={product.name}
                            className="p-2 rounded-2xl w-full h-64 object-cover"
                        />

                        {/* Navigation Buttons with Dot Indicators */}
                        <div className="flex justify-center items-center gap-4 mt-4 mb-2">
                            <button
                                onClick={prevImage}
                                className="bg-green-600 text-white py-1.5 px-4 rounded-sm shadow-2xl border border-gray-300 cursor-pointer hover:bg-green-700 transition-colors"
                            >
                                <ArrowLeftFromLine className="h-4 w-4" />
                            </button>

                            {/* Dot Indicators */}
                            <div className="flex gap-2">
                                {product.images?.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`w-1.5 h-1.5 rounded-full transition-colors ${index === currentImageIndex
                                            ? 'bg-green-600'
                                            : 'bg-gray-300 hover:bg-gray-400'
                                            }`}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={nextImage}
                                className="bg-green-600 text-white py-1.5 px-4 rounded-sm shadow-2xl border border-gray-300 cursor-pointer hover:bg-green-700 transition-colors"
                            >
                                <ArrowRightFromLine className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div className="p-2">

                        {/* Product Description */}
                        <p className="text-gray-600 mb-4">{product.description}</p>

                        {/* Price | Bid | Quantity | Verification Information */}
                        <div className="bg-gray-50 rounded-lg border border-gray-300 p-2 mb-2">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

                                <div className="border-r border-gray-300">
                                    <div className="flex items-center justify-around mb-2">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm font-medium text-gray-600">Starting Price</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center space-x-1">
                                        <p className="text-xl font-medium text-green-600">
                                            {product?.startingPrice?.toLocaleString('en-IN') || '0'}
                                        </p>
                                    </div>
                                </div>

                                <div className="md:border-r border-gray-300">
                                    <div className="flex items-center justify-around mb-2">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm font-medium text-gray-600">Highest Bid</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center space-x-1">
                                        <p className="text-xl font-medium text-green-600">
                                            {product?.currentHighestBid?.toLocaleString('en-IN') || '0'}
                                        </p>
                                    </div>
                                </div>

                                <div className="border-r border-gray-300">
                                    <div className="flex items-center justify-around mb-2">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm font-medium text-gray-600">Quantity</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center space-x-1">
                                        <p className="font-medium text-green-600">
                                            <span className="text-xl">{product.quantity.value}</span> <span className="text-sm">{product.quantity.unit}</span>
                                        </p>
                                    </div>
                                </div>

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

                        {/* FarmerID | ProductID */}
                        <div className="bg-gray-50 grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2 border border-gray-300 rounded-lg p-2">
                            <div className="flex items-center space-x-2">
                                <User className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600 font-medium">
                                    Farmer ID: <span className="font-mono">{product.farmerId}</span>
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Package className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600 font-medium">
                                    Product ID: <span className="font-mono">{product._id}</span>
                                </span>
                            </div>
                        </div>

                        {/* Bidding Date | Bidding Timeline */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">

                            <div className="bg-gray-50 border border-gray-300 rounded-lg p-2">
                                <h3 className="text-center text-sm font-medium text-gray-800 mb-2">Bidding Date</h3>
                                <div className="border-t border-gray-300">
                                    <div className="mt-[36px]">
                                        <div className="grid grid-cols-2">
                                            <div className="text-center">
                                                <div className="text-[10px] text-gray-500 font-medium mb-0.2">Start Date</div>
                                            </div>

                                            <div className="text-center">
                                                <div className="text-[10px] text-gray-500 font-medium mb-0.2">End Date</div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 relative">
                                            <div className="text-center">
                                                <div className="bg-white border-l border-t border-b border-gray-300 rounded-l-md py-1">
                                                    <span className="text-sm font-bold text-green-600">                                                       
                                                        {formatDate(product.bidStartDate)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                                                <MoveHorizontal className="w-6 h-6 text-gray-400" />
                                            </div>

                                            <div className="text-center">
                                                <div className="bg-white border-r border-t border-b border-gray-300 rounded-r-md py-1">
                                                    <span className="text-sm font-bold text-red-600">                                                       
                                                        {formatDate(product.bidEndDate)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 border border-gray-300 rounded-lg p-2">
                                <h3 className="text-center text-sm font-medium text-gray-800 mb-2">Bidding Time</h3>
                                <div className="border-t border-gray-300">
                                    <div className="flex justify-center items-center gap-2 mb-2 mt-2">
                                        <span className="text-sm font-semibold text-gray-700">                                        
                                            {formatDate(product.bidStartDate)}
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

                                    <div className="grid grid-cols-2 relative">
                                        <div className="text-center">
                                            <div className="bg-white border-l border-t border-b border-gray-300 rounded-l-md py-1">
                                                <span className="text-sm font-bold text-green-600">                                                    
                                                    {formatTime(product.bidStartTime)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                                            <MoveHorizontal className="w-6 h-6 text-gray-400" />
                                        </div>

                                        <div className="text-center">
                                            <div className="bg-white border-r border-t border-b border-gray-300 rounded-r-md py-1">
                                                <span className="text-sm font-bold text-red-600">                                                   
                                                    {formatTime(product.bidEndTime)}
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
        </>
    );
};

export default ProductDetails;