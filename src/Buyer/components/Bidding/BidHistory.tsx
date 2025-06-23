import {
    RefreshCw,
    Clock,
    Shield,
    TrendingUp,
    Award,
    Zap,
    ArrowUp,
} from "lucide-react";

interface Bid {
    id: number;
    userName: string;
    userAvatar: string;
    amount: number;
    previousAmount: number;
    timestamp: string;
    fullTimestamp: string;
    bidType: string;
    verificationStatus: "verified" | "unverified";
    isHighest: boolean;
    isNewBid: boolean;
}

interface BidHistoryProps {
    bids: Bid[];
    onPlaceBidClick: () => void;
}

const BidHistory = ({ bids, onPlaceBidClick }: BidHistoryProps) => {
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

    const getIncreaseAmount = (current: number, previous: number) => {
        return current - previous;
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-3 py-4 border-b border-gray-300">
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

                        {/* Place Bid Button */}
                        <button
                            onClick={onPlaceBidClick}
                            className="px-4 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 cursor-pointer"
                        >
                            Place Bid
                        </button>
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
                        className={`p-3 border-b border-gray-100 transition-all duration-300 hover:bg-gray-50 ${
                            bid.isNewBid ? "bg-blue-50 border-blue-500" : ""
                        } ${
                            bid.isHighest
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

                            {/* Right Section - Bid Amount & Previous Bid */}
                            <div className="text-right flex-shrink-0">
                                <div
                                    className={`text-lg sm:text-2xl font-bold mb-1 ${
                                        bid.isHighest ? "text-green-600" : "text-gray-800"
                                    }`}
                                >
                                    ₹{bid.amount.toLocaleString()}
                                </div>

                                {/* Previous Bid Amount with Up Arrow */}
                                <div className="flex items-center justify-end space-x-1 mb-2">
                                    <div className="flex items-center space-x-1 px-2 py-1 bg-green-50 rounded-md">
                                        <ArrowUp className="h-3 w-3 text-green-600" />
                                        <span className="text-xs text-green-700 font-medium">
                                            ₹
                                            {getIncreaseAmount(
                                                bid.amount,
                                                bid.previousAmount
                                            ).toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="text-xs text-gray-500 mb-1">
                                    <span className="hidden sm:inline">Previous: </span>₹
                                    {bid.previousAmount.toLocaleString()}
                                </div>

                                {bid.isHighest && (
                                    <div className="text-xs text-green-600 font-medium mb-1">
                                        Leading Bid
                                    </div>
                                )}

                                <div className="text-xs text-gray-400">
                                    <span className="hidden sm:inline">
                                        {bid.fullTimestamp}
                                    </span>
                                    <span className="sm:hidden">{bid.fullTimestamp}</span>
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
    );
};

export default BidHistory;