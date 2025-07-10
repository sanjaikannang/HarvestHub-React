import {
    Clock,
    Shield,
    TrendingUp,
    Award,
    Zap,
    ArrowUp,
    Timer,
    CheckCircle,
    AlertCircle,
    RotateCw,
} from "lucide-react";
import { BiddingStatus } from "../../../utils/enum";
import { useState } from "react";

interface Bid {
    bidId: string;
    productId: string;
    bidderId: string;
    bidderName: string;
    bidderInitials: string;
    currentBidAmount: number;
    previousBidAmount: number;
    incrementAmount: number;
    bidTime: string;
    timeAgo: string;
    isWinningBid: boolean;
    bidStatus: string;
    bidType: "MANUAL" | "AUTO";
}

interface BidHistoryProps {
    bids: Bid[];
    onPlaceBidClick: () => void;
    onRefreshBids: () => void;
    biddingStatus: BiddingStatus;
    timeRemaining: string;
    loading?: boolean;
    totalBids?: number;
    highestBid?: number;
    startingPrice?: number;
}

const BidHistory = ({
    bids,
    onPlaceBidClick,
    onRefreshBids,
    biddingStatus,
    timeRemaining,
    loading = false,
    totalBids = 0,
    highestBid = 0,
    startingPrice = 0
}: BidHistoryProps) => {

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

    const getBidTypeDisplayName = (bidType: string) => {
        return bidType === "AUTO" ? "Auto Bid" : "Manual Bid";
    };

    const formatTimestamp = (bidTime: string) => {
        const date = new Date(bidTime);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const getStatusConfig = () => {
        switch (biddingStatus) {
            case BiddingStatus.NOT_STARTED:
                return {
                    icon: <Timer className="h-4 w-4 text-orange-600" />,
                    text: "STARTS IN",
                    color: "bg-orange-100 border-orange-300 text-orange-700",
                    dotColor: "bg-orange-500",
                    timeColor: "text-orange-600"
                };
            case BiddingStatus.ACTIVE:
                return {
                    icon: <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>,
                    text: "LIVE",
                    color: "bg-green-100 border-green-300 text-green-700",
                    dotColor: "bg-green-500",
                    timeColor: "text-red-400"
                };
            case BiddingStatus.ENDED:
                return {
                    icon: <CheckCircle className="h-4 w-4 text-gray-600" />,
                    text: "ENDED",
                    color: "bg-gray-100 border-gray-300 text-gray-700",
                    dotColor: "bg-gray-500",
                    timeColor: "text-gray-600"
                };
            default:
                return {
                    icon: <AlertCircle className="h-4 w-4 text-gray-600" />,
                    text: "UNKNOWN",
                    color: "bg-gray-100 border-gray-300 text-gray-700",
                    dotColor: "bg-gray-500",
                    timeColor: "text-gray-600"
                };
        }
    };

    const statusConfig = getStatusConfig();

    const renderBiddingEndedState = () => (
        <>
            <div className="p-8 text-center bg-gray-50">
                <div className="mb-4">
                    <CheckCircle className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Bidding Has Ended</h3>
                </div>
            </div>
        </>
    );

    const renderCountdownState = () => (
        <>
            <div className="p-8 text-center bg-white">
                <div className="mb-4">
                    <Timer className="h-16 w-16 text-orange-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Bidding Starts Soon</h3>
                    <p className="text-gray-600 mb-4">
                        Get ready! The auction will begin in:
                    </p>
                    <div>
                        <p className="text-3xl font-mono text-orange-600">{timeRemaining}</p>
                        <p className="text-sm text-gray-600 mt-2">Hours : Minutes : Seconds</p>
                    </div>
                </div>
            </div>
        </>
    );

    const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(false);

    return (
        <>
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
                                        {biddingStatus === BiddingStatus.NOT_STARTED ? 'Auction countdown' :
                                            biddingStatus === BiddingStatus.ACTIVE ? 'Live Bid activity' :
                                                'Auction completed'}
                                    </p>
                                </div>
                            </div>

                            {/* Right Side - Live Status and Buttons */}
                            <div className="flex flex-col items-end space-y-2">
                                {/* Status Indicator */}
                                <div className={`flex items-center space-x-2 px-2 py-1.5 rounded-full border ${statusConfig.color}`}>
                                    {statusConfig.icon}
                                    <span className="text-xs font-medium">
                                        {statusConfig.text}
                                    </span>
                                </div>

                                {/* Refresh Button - Only show when bidding is active */}
                                {biddingStatus === BiddingStatus.ACTIVE && (
                                    <button
                                        onClick={onRefreshBids}
                                        disabled={loading}
                                        className="flex items-center justify-center p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 cursor-pointer"
                                    >
                                        <RotateCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                                    </button>
                                )}
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
                                    <p className={`text-lg font-mono ${statusConfig.timeColor}`}>
                                        {timeRemaining}
                                    </p>
                                </div>
                            </div>

                            {/* Place Bid Button */}
                            {biddingStatus === BiddingStatus.ACTIVE && (
                                <button
                                    onClick={onPlaceBidClick}
                                    className="px-4 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 cursor-pointer"
                                >
                                    Place Bid
                                </button>
                            )}
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
                                <p className="text-sm text-gray-600">
                                    {biddingStatus === BiddingStatus.NOT_STARTED ? 'Auction countdown' :
                                        biddingStatus === BiddingStatus.ACTIVE ? 'Live Bid activity' :
                                            'Auction completed'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className={`flex items-center px-2 py-1 rounded-full border ${statusConfig.color}`}>
                                {statusConfig.icon}
                                <span className="ml-3 text-xs font-medium">
                                    {statusConfig.text}
                                </span>
                            </div>

                            {/* Controls - Right Side */}
                            {biddingStatus === BiddingStatus.ACTIVE && (
                                <div className="flex flex-col space-y-2">
                                    {/* First Row - Auto Refresh Toggle */}
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xs text-gray-600">Auto Refresh:</span>
                                        <div className="flex bg-gray-200 rounded-l-xl rounded-r-xl border border-gray-300">
                                            <button
                                                type="button"
                                                onClick={() => setAutoRefreshEnabled(true)}
                                                className={`px-2 py-0.5 text-[10px] rounded-l-xl transition-colors cursor-pointer ${autoRefreshEnabled
                                                    ? 'bg-green-500 text-white'
                                                    : 'text-gray-600 hover:text-gray-800'
                                                    }`}
                                            >
                                                ON
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setAutoRefreshEnabled(false)}
                                                className={`px-2 py-0.5 text-[10px] rounded-r-xl transition-colors cursor-pointer ${!autoRefreshEnabled
                                                    ? 'bg-green-500 text-white'
                                                    : 'text-gray-600 hover:text-gray-800'
                                                    }`}
                                            >
                                                OFF
                                            </button>
                                        </div>                               
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            onClick={onRefreshBids}
                                            disabled={loading}
                                            className="flex items-center justify-center p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 cursor-pointer"
                                        >
                                            <RotateCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                                        </button>
                                    </div>
                                </div>

                            )}
                        </div>
                    </div>
                </div>


                {/* Content Area */}
                {biddingStatus === BiddingStatus.ENDED ? (
                    renderBiddingEndedState()
                ) : biddingStatus === BiddingStatus.NOT_STARTED ? (
                    renderCountdownState()
                ) : (
                    <>
                        {/* Bid List */}
                        <div className="max-h-[500px] overflow-y-auto">
                            {bids.length === 0 ? (
                                <div className="p-8 text-center">
                                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No Bids Yet</h3>
                                    <p className="text-gray-600">Be the first to place a bid on this item!</p>
                                </div>
                            ) : (
                                bids.map((bid, index) => (
                                    <div
                                        key={bid.bidId}
                                        className={`p-3 border-b border-gray-100 transition-all duration-300 hover:bg-gray-50 ${bid.isWinningBid ? "bg-blue-50 border-blue-500" : ""
                                            } ${bid.isWinningBid
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
                                                        {bid.bidderInitials}
                                                    </div>
                                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full flex items-center justify-center">
                                                        <Shield className="h-2 w-2 sm:h-3 sm:w-3 text-green-500" />
                                                    </div>
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center space-x-2 mb-1 flex-wrap gap-1">
                                                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                                                            {bid.bidderName}
                                                        </h4>
                                                        {bid.isWinningBid && (
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
                                                            <span>{bid.timeAgo}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center space-x-2 flex-wrap gap-1">
                                                        <span
                                                            className={`px-2 py-1 text-xs font-medium rounded-md border ${getBidTypeColor(
                                                                bid.bidType
                                                            )}`}
                                                        >
                                                            {getBidTypeDisplayName(bid.bidType)}
                                                        </span>

                                                        {bid.bidType === "AUTO" && (
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

                                            {/* Right Section - Bid Info */}
                                            <div className="text-right flex-shrink-0">
                                                <div
                                                    className={`text-lg sm:text-2xl font-bold mb-1 ${bid.isWinningBid ? "text-green-600" : "text-gray-800"
                                                        }`}
                                                >
                                                    ₹{bid.currentBidAmount}
                                                </div>

                                                {/* Previous Bid Amount with Up Arrow */}
                                                <div className="flex items-center justify-end space-x-1 mb-2">
                                                    <div className="flex items-center space-x-1 px-2 py-1 bg-green-50 rounded-md">
                                                        <ArrowUp className="h-3 w-3 text-green-600" />
                                                        <span className="text-xs text-green-700 font-medium">
                                                            ₹{bid.incrementAmount}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="text-xs text-gray-500 mb-1">
                                                    <span className="hidden sm:inline">Previous: </span>₹
                                                    {bid.previousBidAmount}
                                                </div>

                                                {bid.isWinningBid && (
                                                    <div className="text-xs text-green-600 font-medium mb-1">
                                                        Leading Bid
                                                    </div>
                                                )}

                                                <div className="text-xs text-gray-400">
                                                    <span className="hidden sm:inline">
                                                        {formatTimestamp(bid.bidTime)}
                                                    </span>
                                                    <span className="sm:hidden">{formatTimestamp(bid.bidTime)}</span>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                )}

                {/* Footer */}
                <div className="px-3 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 flex-wrap gap-2">
                        <span>Total {totalBids} Bids</span>
                        <div className="flex items-center space-x-2 sm:space-x-4 text-xs">
                            <span>Highest: ₹{highestBid}</span>
                            <span className="hidden sm:inline">Starting: ₹{startingPrice}</span>
                            <span className="hidden sm:inline">Auto-refresh: ON</span>
                            <span className="sm:hidden">Auto: ON</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BidHistory;