import { useState } from "react";
import {
    Users,
    DollarSign,
    Eye,
    Calendar,
    Package,
    ChevronUp,
    ChevronDown,
} from "lucide-react";

interface Product {
    name: string;
    description: string;
    category: string;
    farmer: string;
    location: string;
    quantity: string;
    quality: string;
    harvestDate: string;
    currentPrice: number;
    imageUrl: string;
    isActive: boolean;
}

interface ProductDetailsProps {
    product: Product;
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
    const [isProductDetailsOpen, setIsProductDetailsOpen] = useState(true);

    const toggleProductDetails = () => {
        setIsProductDetailsOpen(!isProductDetailsOpen);
    };

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
                <div className="aspect-w-16 aspect-h-9">
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-64 object-cover"
                    />
                </div>
                <div className="p-6">
                    <p className="text-gray-600 mb-6">{product.description}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <Users className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                    Farmer: <strong>{product.farmer}</strong>
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Package className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                    Category: <strong>{product.category}</strong>
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                    Harvest: <strong>{product.harvestDate}</strong>
                                </span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <Eye className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                    Location: <strong>{product.location}</strong>
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Package className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                    Quantity: <strong>{product.quantity}</strong>
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <DollarSign className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                    Quality: <strong>{product.quality}</strong>
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