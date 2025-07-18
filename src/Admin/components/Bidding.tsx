import React, { useState } from "react";
import {
    Users,
    DollarSign,
    Eye,
    Calendar,
    Package,
    ChevronUp,
    ChevronDown,
    RefreshCw,
    Clock,
    Shield,
    TrendingUp,
    Award,
    Zap,
} from "lucide-react";

const Bidding: React.FC = () => {
    const [isProductDetailsOpen, setIsProductDetailsOpen] = useState(true);

    const product = {
        name: "Premium Organic Tomatoes",
        description:
            "Fresh, vine-ripened organic tomatoes grown without pesticides. Perfect for restaurants and grocery stores.",
        category: "Vegetables",
        farmer: "John Smith Farm",
        location: "Karnataka, India",
        quantity: "500 kg",
        quality: "Grade A",
        harvestDate: "2025-06-15",
        currentPrice: 1850,
        imageUrl:
            "https://static.vecteezy.com/system/resources/previews/044/784/451/non_2x/fresh-organic-vegetables-on-farmer-market-local-farm-bazaar-assortment-of-fresh-organic-harvest-garden-produce-bio-products-bio-ecology-natural-healthy-food-festival-agricultural-rustic-fair-photo.jpeg",
        isActive: true,
    };

    const [bids] = useState([
        {
            id: 1,
            userName: "Rajesh Kumar",
            userAvatar: "RK",
            amount: 95000,
            previousAmount: 90000,
            timestamp: "2 min ago",
            fullTimestamp: "Today at 14:32",
            bidType: "Manual Bid",
            verificationStatus: "verified",
            isHighest: true,
            isNewBid: true,
        },
        {
            id: 2,
            userName: "Priya Sharma",
            userAvatar: "PS",
            amount: 92000,
            previousAmount: 85000,
            timestamp: "5 min ago",
            fullTimestamp: "Today at 14:29",
            bidType: "Auto Bid",
            verificationStatus: "verified",
            isHighest: false,
            isNewBid: false,
        },
        {
            id: 3,
            userName: "Amit Patel",
            userAvatar: "AP",
            amount: 90000,
            previousAmount: 88000,
            timestamp: "8 min ago",
            fullTimestamp: "Today at 14:26",
            bidType: "Manual Bid",
            verificationStatus: "unverified",
            isHighest: false,
            isNewBid: false,
        },
        {
            id: 4,
            userName: "Sneha Reddy",
            userAvatar: "SR",
            amount: 88000,
            previousAmount: 82000,
            timestamp: "12 min ago",
            fullTimestamp: "Today at 14:22",
            bidType: "Auto Bid",
            verificationStatus: "verified",
            isHighest: false,
            isNewBid: false,
        },
        {
            id: 5,
            userName: "Vikram Singh",
            userAvatar: "VS",
            amount: 85000,
            previousAmount: 80000,
            timestamp: "15 min ago",
            fullTimestamp: "Today at 14:19",
            bidType: "Manual Bid",
            verificationStatus: "verified",
            isHighest: false,
            isNewBid: false,
        },
    ]);

    const getAvatarColor = (index: number) => {
        const colors = [
            "bg-blue-500",
            "bg-purple-500",
            "bg-green-500",
            "bg-orange-500",
            "bg-red-500",
            "bg-indigo-500",
            "bg-pink-500",
        ];
        return colors[index % colors.length];
    };

    const getBidTypeColor = (bidType: string) => {
        return bidType === "Auto Bid"
            ? "bg-blue-50 text-blue-700 border-blue-200"
            : "bg-green-50 text-green-700 border-green-200";
    };

    const toggleProductDetails = () => {
        setIsProductDetailsOpen(!isProductDetailsOpen);
    };

    return (
        <>
            <main className="px-4 py-4 bg-gray-50 max-w-9xl mx-auto min-h-screen">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Bidding Dashboard
                        </h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Left Side - Product Details and Bid History */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Product Details */}
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

                        {/* Bid History */}
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-3 sm:px-6 py-4 sm:py-5 border-b border-gray-300">
                                {/* Mobile Layout */}
                                <div className="block lg:hidden">
                                    <div className="flex items-center justify-between mb-2">
                                        {/* Left Side - Title and Time */}
                                        <div className="flex items-center space-x-2">
                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                <TrendingUp className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">
                                                    Bid History
                                                </h3>
                                                <p className="text-xs text-gray-600 mb-2">
                                                    Live Bid activity
                                                </p>
                                            </div>
                                        </div>

                                        {/* Right Side - Live Status and Buttons */}
                                        <div className="flex flex-col items-end space-y-2">
                                            {/* Live Status and Refresh Button */}
                                            <div className="flex items-center space-x-2">
                                                <div className="flex items-center space-x-2 px-2 py-1.5 bg-green-100 rounded-full border border-green-900">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                    <span className="text-xs font-medium text-green-700">
                                                        LIVE
                                                    </span>
                                                </div>
                                                <button className="flex items-center justify-center p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 cursor-pointer">
                                                    <RefreshCw className="h-3 w-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200"></div>

                                    <div className="flex items-center justify-between mt-3">
                                        {/* Time Remaining on Mobile */}
                                        <div className="flex items-center">
                                            {/* Icon with right border */}
                                            <div className="px-3 py-2 bg-gray-100 rounded-l-lg border border-gray-200 border-r-gray-300 border-r">
                                                <Clock className="h-5 w-5 text-gray-500" />
                                            </div>

                                            {/* Content immediately after icon */}
                                            <div className="px-4 py-1 bg-gray-100 border-t border-b border-r border-gray-200 rounded-r-lg">
                                                <p className="text-lg font-mono text-red-400">
                                                    02:45:32
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Desktop Layout */}
                                <div className="hidden lg:flex items-center justify-between flex-wrap">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <TrendingUp className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">
                                                Bid History
                                            </h3>
                                            <p className="text-sm text-gray-600">Live Bid activity</p>
                                        </div>
                                    </div>

                                    {/* Time Remaining - Hidden on large screens */}
                                    <div className="lg:hidden">
                                        <p className="text-sm text-gray-600 mb-1">Time Remaining</p>
                                        <p className="text-xl font-mono font-bold text-gray-900">
                                            02:45:32
                                        </p>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center px-4 py-1.5 bg-green-100 rounded-full border border-green-300">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                                            <span className="ml-3 text-xs font-medium text-green-700">
                                                LIVE
                                            </span>
                                        </div>

                                        <button className="flex items-center justify-center p-2.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 cursor-pointer">
                                            <RefreshCw className="h-4 w-4" />
                                        </button>

                                        {/* Place Bid Button - Hidden on large screens */}
                                        <button className="lg:hidden px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 cursor-pointer">
                                            Place Bid
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Bid List */}
                            <div className="max-h-[500px] overflow-y-auto">
                                {bids.map((bid, index) => (
                                    <div
                                        key={bid.id}
                                        className={`p-3 border-b border-gray-100 transition-all duration-300 hover:bg-gray-50 ${bid.isNewBid
                                            ? "bg-blue-50 border-blue-500"
                                            : ""
                                            } ${bid.isHighest
                                                ? "bg-gradient-to-r from-green-50 to-emerald-50"
                                                : ""
                                            }`}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            {/* S.No. Section */}
                                            <div className="flex-shrink-0 flex items-center justify-center w-4 h-4 bg-gray-100 rounded-full text-[10px] font-semibold text-gray-600 border border-gray-300">
                                                {index + 1}
                                            </div>

                                            {/* Left Section - User Info */}
                                            <div className="flex items-start space-x-2 sm:space-x-4 flex-1">
                                                <div className="relative flex-shrink-0">
                                                    <div
                                                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm ${getAvatarColor(
                                                            index
                                                        )}`}
                                                    >
                                                        {bid.userAvatar}
                                                    </div>
                                                    {bid.verificationStatus === "verified" && (
                                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full flex items-center justify-center">
                                                            <Shield className="h-2 w-2 sm:h-3 sm:w-3 text-green-500" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center space-x-2 mb-1 flex-wrap gap-1">
                                                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                                                            {bid.userName}
                                                        </h4>
                                                        {bid.isHighest && (
                                                            <div className="flex items-center space-x-1 px-1.5 sm:px-2 py-0.5 bg-green-100 rounded-full border border-green-200">
                                                                <Award className="h-2 w-2 sm:h-3 sm:w-3 text-green-600" />
                                                                <span className="text-xs text-green-700 font-medium hidden sm:inline">
                                                                    Top Bid
                                                                </span>
                                                                <span className="text-xs text-green-700 font-medium sm:hidden">
                                                                    Top
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center space-x-2 sm:space-x-4 text-xs text-gray-500 mb-2">
                                                        <div className="flex items-center space-x-1">
                                                            <Clock className="h-3 w-3" />
                                                            <span>{bid.timestamp}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center space-x-2 flex-wrap gap-1">
                                                        <span
                                                            className={`px-2 py-1 text-xs font-medium rounded-md border ${getBidTypeColor(
                                                                bid.bidType
                                                            )}`}
                                                        >
                                                            {bid.bidType}
                                                        </span>

                                                        {bid.bidType === "Auto Bid" && (
                                                            <div className="flex items-center space-x-1 text-xs text-blue-600">
                                                                <Zap className="h-3 w-3" />
                                                                <span className="hidden sm:inline">
                                                                    Auto-bidding active
                                                                </span>
                                                                <span className="sm:hidden">Auto</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="px-3 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-200">
                                <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 flex-wrap gap-2">
                                    <span>Showing {bids.length} recent bids</span>
                                    <div className="flex items-center space-x-2 sm:space-x-4 text-xs">
                                        <span>Highest: ₹{bids[0]?.amount.toLocaleString()}</span>
                                        <span className="hidden sm:inline">Auto-refresh: ON</span>
                                        <span className="sm:hidden">Auto: ON</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>

    );
};

export default Bidding;