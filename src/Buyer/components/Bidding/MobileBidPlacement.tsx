import { Gavel, Info, X } from "lucide-react";
import { BiddingStatus } from "../../../utils/enum";

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
    bidType: any;
}

interface MobileBidPlacementProps {
    bids: Bid[];
    biddingStatus: any;
    timeRemaining: string;
    currentHighestBid: number;
    minimumBidAmount: number;
    isBiddingActive: boolean;
    bidAmount: string;
    setBidAmount: (amount: string) => void;
    isAutomaticBidding: boolean;
    setIsAutomaticBidding: (isAuto: boolean) => void;
    automaticBidIncrement: string;
    setAutomaticBidIncrement: (increment: string) => void;
    isAutoBidEnabled: boolean;
    setIsAutoBidEnabled: (enabled: boolean) => void;
    placingBid: boolean;
    settingBidMode: boolean;
    fetchingBidMode: boolean;
    error: string | null;
    isSubmitDisabled: boolean;
    handleEnableAutoBid: () => Promise<void>;
    handleSubmitBid: () => Promise<void>;
    handleBidModeChange: (isAuto: boolean) => void;
    handleDisableAutoBid: () => Promise<void>;
    isBottomSheetOpen: boolean;
    onCloseBidSheet: () => void;
}

const MobileBidPlacement = ({
    biddingStatus,
    timeRemaining,
    currentHighestBid,
    minimumBidAmount,
    isBiddingActive,
    bidAmount,
    setBidAmount,
    isAutomaticBidding,
    automaticBidIncrement,
    setAutomaticBidIncrement,
    isAutoBidEnabled,
    placingBid,
    settingBidMode,
    fetchingBidMode,
    error,
    isSubmitDisabled,
    handleEnableAutoBid,
    handleSubmitBid,
    handleBidModeChange,
    handleDisableAutoBid,
    isBottomSheetOpen,
    onCloseBidSheet
}: MobileBidPlacementProps) => {

    // Helper function to determine submit button action
    const handleSubmitAction = () => {
        if (isAutomaticBidding) {
            if (isAutoBidEnabled) {
                handleDisableAutoBid();
            } else {
                handleEnableAutoBid();
            }
        } else {
            handleSubmitBid();
        }
    };

    // Helper function to get submit button text
    const getSubmitButtonText = () => {
        if (placingBid) return 'Placing Bid...';
        if (settingBidMode) return 'Setting Mode...';
        if (fetchingBidMode) return 'Loading...';
        
        if (isAutomaticBidding) {
            return isAutoBidEnabled ? 'Disable Auto-Bidding' : 'Enable Auto-Bidding';
        }
        return 'Place Bid Now';
    };

    return (
        <>
            {/* Bottom Sheet for Mobile Bid Placement */}
            {isBottomSheetOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                        onClick={onCloseBidSheet}
                    >
                        {/* Bottom Sheet */}
                        <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 lg:hidden transform transition-transform duration-300 ease-out">
                            {/* Header */}
                            <div className="px-4 py-3 border-b border-gray-200">
                                <div className="flex justify-center items-center relative">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                                        <Gavel className="h-5 w-5" />
                                        <span>Place Your Bid</span>
                                    </h3>
                                    <button
                                        onClick={onCloseBidSheet}
                                        className="absolute right-0 p-2 rounded-full hover:bg-gray-100 transition-colors"
                                    >
                                        <X className="h-5 w-5 text-gray-500" />
                                    </button>
                                </div>
                                {/* Time Remaining Display */}
                                {timeRemaining && isBiddingActive && (
                                    <div className="text-center mt-2">
                                        <p className="text-sm text-red-600 font-medium">
                                            Time Remaining: {timeRemaining}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-4 pb-6 max-h-[70vh] overflow-y-auto">
                                {!isBiddingActive ? (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 mb-2">
                                            {biddingStatus === BiddingStatus.NOT_STARTED ? 'Bidding hasn\'t started yet' : 'Bidding has ended'}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            {biddingStatus === BiddingStatus.NOT_STARTED ? 'Please wait for the auction to begin' : 'Thank you for your participation'}
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Current Price Display */}
                                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                            <div className="text-center">
                                                <p className="text-sm text-gray-600 mb-1">Current Highest Bid</p>
                                                <p className="text-2xl font-bold text-green-600">₹{currentHighestBid.toLocaleString()}</p>
                                            </div>
                                        </div>

                                        {/* Auto-bid Status Indicator */}
                                        {isAutomaticBidding && isAutoBidEnabled && (
                                            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                                    <span className="text-sm font-medium text-emerald-700">Auto-bidding is active</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Bidding Mode Toggle */}
                                        <div className="mb-4">
                                            <p className="text-sm font-medium text-gray-700 mb-3">Choose Bidding Mode</p>
                                            <div className="grid grid-cols-2 gap-3">
                                                <label className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all ${!isAutomaticBidding
                                                    ? 'border-emerald-500 bg-emerald-50'
                                                    : 'border-gray-200 bg-white'
                                                    }`}>
                                                    <input
                                                        type="radio"
                                                        name="biddingMode"
                                                        checked={!isAutomaticBidding}
                                                        onChange={() => handleBidModeChange(false)}
                                                        className="sr-only"
                                                        disabled={settingBidMode || fetchingBidMode}
                                                    />
                                                    <div className="text-center">
                                                        <div className={`text-sm font-medium ${!isAutomaticBidding ? 'text-emerald-700' : 'text-gray-700'}`}>
                                                            Manual
                                                        </div>
                                                        <div className={`text-xs ${!isAutomaticBidding ? 'text-emerald-600' : 'text-gray-500'}`}>
                                                            Full control
                                                        </div>
                                                    </div>
                                                </label>

                                                <label className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all ${isAutomaticBidding
                                                    ? 'border-emerald-500 bg-emerald-50'
                                                    : 'border-gray-200 bg-white'
                                                    }`}>
                                                    <input
                                                        type="radio"
                                                        name="biddingMode"
                                                        checked={isAutomaticBidding}
                                                        onChange={() => handleBidModeChange(true)}
                                                        className="sr-only"
                                                        disabled={settingBidMode || fetchingBidMode}
                                                    />
                                                    <div className="text-center">
                                                        <div className={`text-sm font-medium ${isAutomaticBidding ? 'text-emerald-700' : 'text-gray-700'}`}>
                                                            Auto
                                                        </div>
                                                        <div className={`text-xs ${isAutomaticBidding ? 'text-emerald-600' : 'text-gray-500'}`}>
                                                            Set & forget
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>

                                        {/* Automatic Bidding Settings */}
                                        {isAutomaticBidding && (
                                            <div className="mb-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Increment Amount (₹)
                                                        </label>
                                                        <input
                                                            type="number"
                                                            value={automaticBidIncrement}
                                                            onChange={(e) => setAutomaticBidIncrement(e.target.value)}
                                                            placeholder="100"
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                                                            min="1"
                                                            disabled={isAutoBidEnabled}
                                                        />
                                                    </div>
                                                    <div className="bg-white rounded-lg p-3 border border-emerald-100">
                                                        <div className="flex justify-between items-center text-xs">
                                                            <span className="text-gray-600">Your next bid:</span>
                                                            <span className="font-bold text-emerald-700">
                                                                ₹{(currentHighestBid + Number(automaticBidIncrement || 0)).toLocaleString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Manual Bid Input */}
                                        {!isAutomaticBidding && (
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Your Bid Amount
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₹</span>
                                                    <input
                                                        type="number"
                                                        value={bidAmount}
                                                        onChange={(e) => setBidAmount(e.target.value)}
                                                        placeholder={`Min: ${minimumBidAmount.toLocaleString()}`}
                                                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-lg font-semibold"
                                                        min={minimumBidAmount}
                                                    />
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1 flex items-center space-x-1">
                                                    <Info className="h-3 w-3" />
                                                    <span>Minimum bid: ₹{minimumBidAmount.toLocaleString()}</span>
                                                </p>
                                            </div>
                                        )}

                                        {/* Error Display */}
                                        {error && (
                                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                                                <p className="text-sm text-red-700">{error}</p>
                                            </div>
                                        )}

                                        {/* Submit Button */}
                                        <button
                                            onClick={handleSubmitAction}
                                            disabled={isSubmitDisabled || placingBid || settingBidMode || fetchingBidMode}
                                            className={`w-full py-3 px-6 rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
                                                isSubmitDisabled || placingBid || settingBidMode || fetchingBidMode
                                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                    : isAutomaticBidding && isAutoBidEnabled
                                                        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl'
                                                        : 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 shadow-lg hover:shadow-xl'
                                                }`}
                                        >
                                            {placingBid || settingBidMode || fetchingBidMode ? (
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            ) : (
                                                <Gavel className="h-5 w-5" />
                                            )}
                                            <span>{getSubmitButtonText()}</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default MobileBidPlacement;