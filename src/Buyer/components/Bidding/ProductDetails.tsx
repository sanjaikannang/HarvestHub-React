import { useState } from "react";
import {
    Users,
    DollarSign,
    Eye,
    Calendar,
    Package,
    ChevronUp,
    ChevronDown,
    Clock,
    TrendingUp,
    Weight,
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

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
        }).format(price);
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

    console.log("product result....", product)

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
                        <span className={`px-2 py-1 rounded-full text-xs font-medium`}>
                            {product.productStatus}
                        </span>
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

                <div className="p-6">
                    <p className="text-gray-600 mb-6">{product.description}</p>

                    {/* Price Information */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2">
                                <DollarSign className="h-5 w-5 text-blue-600" />
                                <div>
                                    <span className="text-sm text-gray-600">Starting Price</span>
                                    <p className="text-lg font-semibold text-blue-600">
                                        {formatPrice(product.startingPrice)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <TrendingUp className="h-5 w-5 text-green-600" />
                                <div>
                                    <span className="text-sm text-gray-600">Current Highest Bid</span>
                                    <p className="text-lg font-semibold text-green-600">
                                        {formatPrice(product.currentHighestBid)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <Users className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                    Farmer ID: <strong>{product.farmerId}</strong>
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Weight className="h-4 w-4 text-gray-400" />
                                {/* <span className="text-sm text-gray-600">
                                    Quantity: <strong>{product.quantity.value}</strong>
                                </span> */}
                            </div>
                            <div className="flex items-center space-x-2">
                                <Package className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                    Product ID: <strong>{product._id}</strong>
                                </span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                {new Date(product.bidStartDate).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                            <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-gray-400" />
                                {new Date(product.bidEndDate).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                            <div className="flex items-center space-x-2">
                                <Eye className="h-4 w-4 text-gray-400" />
                                {/* <span className="text-sm text-gray-600">
                                    Status: <strong className={` px-2 py-1 rounded text-xs`}>
                                        {product.productStatus}
                                    </strong>
                                </span> */}
                            </div>
                        </div>
                    </div>

                    {/* Bidding Timeline */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-gray-800 mb-2">Bidding Timeline</h3>
                        <div className="space-y-2 text-xs text-gray-600">
                            <div className="flex justify-between">
                                <span>Bidding Started:</span>
                                <span className="text-sm font-bold text-green-600">
                                    {new Date(product.bidStartTime).toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: true
                                    })}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Bidding Ends:</span>
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
    );
};

export default ProductDetails;