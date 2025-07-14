import { Info, Gavel } from "lucide-react";
import { BiddingStatus } from "../../../utils/enum";
import Input from "../../../Common/ui/Input";

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

interface DesktopBidPlacementProps {
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
}

const DesktopBidPlacement = ({
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
    isSubmitDisabled,
    handleEnableAutoBid,
    handleSubmitBid,
    handleBidModeChange,
    handleDisableAutoBid
}: DesktopBidPlacementProps) => {

    return (
        <div className="lg:sticky lg:top-20 lg:h-fit space-y-4">
            {/* Current Price & Timer */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 hidden lg:block">
                <div className="text-center space-y-4">
                    <div className="border-b border-gray-300">
                        <p className="text-sm text-gray-600 mb-1">
                            {biddingStatus === BiddingStatus.NOT_STARTED ? 'Starts In' :
                                biddingStatus === BiddingStatus.ACTIVE ? 'Time Remaining' : 'Bidding Ended'}
                        </p>
                        <p className="text-3xl font-mono text-orange-600">{timeRemaining}</p>
                        <p className="text-[12px] text-gray-600 mb-4">Hours : Minutes : Seconds</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 mb-1">Current Price</p>
                        <p className="text-2xl font-bold text-green-600">
                            ₹{currentHighestBid.toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Desktop Place Bid */}
            <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-3 hidden lg:block backdrop-blur-sm">
                {/* Header with enhanced styling */}
                <div className="flex items-center justify-center mb-4">
                    <div className="flex items-center">
                        <h3 className="text-xl font-medium text-gray-900">Place Your Bid</h3>
                        {fetchingBidMode && (
                            <div className="ml-2 animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
                        )}
                    </div>
                </div>

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
                    <div className="space-y-4">
                        {/* Bidding Mode Toggle */}
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                                <label className={`flex items-center justify-center rounded-md border cursor-pointer transition-all duration-200 ${!isAutomaticBidding
                                    ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="desktopBiddingMode"
                                        checked={!isAutomaticBidding}
                                        onChange={() => handleBidModeChange(false)}
                                        className="sr-only"
                                        disabled={settingBidMode}
                                    />
                                    <div className="text-center p-1">
                                        <div className={`text-xs font-medium ${!isAutomaticBidding ? 'text-emerald-700' : 'text-gray-700'}`}>
                                            Manual Bidding
                                        </div>
                                        <div className={`text-[8px] mt-0.5 ${!isAutomaticBidding ? 'text-emerald-600' : 'text-gray-500'}`}>
                                            Full control
                                        </div>
                                    </div>
                                </label>

                                <label className={`flex items-center justify-center rounded-md border cursor-pointer transition-all duration-200 ${isAutomaticBidding
                                    ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="desktopBiddingMode"
                                        checked={isAutomaticBidding}
                                        onChange={() => handleBidModeChange(true)}
                                        className="sr-only"
                                        disabled={settingBidMode}
                                    />
                                    <div className="text-center p-1">
                                        <div className={`text-xs font-medium ${isAutomaticBidding ? 'text-emerald-700' : 'text-gray-700'}`}>
                                            Auto Bidding
                                        </div>
                                        <div className={`text-[8px] mt-0.5 ${isAutomaticBidding ? 'text-emerald-600' : 'text-gray-500'}`}>
                                            Set & forget
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Automatic Bidding Setting */}
                        {isAutomaticBidding && (
                            <div className="bg-gray-50 rounded-lg border border-gray-300 p-2">
                                <div className="flex items-center justify-center space-x-2 mb-3">
                                    <span className="text-sm font-medium text-gray-600">Auto-Bid Configuration</span>
                                </div>

                                <div className="space-y-2">
                                    <Input
                                        id="incrementAmount"
                                        label="Increment Amount"
                                        name="incrementAmount"
                                        type="number"
                                        value={automaticBidIncrement}
                                        onChange={(e) => setAutomaticBidIncrement(e.target.value)}
                                        placeholder="100"
                                        min="1"
                                        disabled={isAutoBidEnabled}
                                    />

                                    {/* Show next bid amount */}
                                    <div className="text-center">
                                        <div className="text-[10px] text-gray-600">Your Next Bid Amount - <span className="text-red-500">₹ {(currentHighestBid + Number(automaticBidIncrement || 0)).toLocaleString()}</span></div>
                                    </div>

                                    {/* Auto bid status */}
                                    {isAutoBidEnabled && (
                                        <div className="bg-white border border-gray-300 rounded-sm py-1 px-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-green-600 font-medium">Auto-bidding enabled</span>
                                                <button
                                                    onClick={handleDisableAutoBid}
                                                    className="text-xs text-red-600 hover:text-red-700 cursor-pointer"
                                                    disabled={settingBidMode}
                                                >
                                                    Disable
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Manual Bid Input with enhanced design */}
                        {!isAutomaticBidding && (
                            <div className="space-y-1">
                                <div>
                                    <Input
                                        id="bidAmount"
                                        label="Your Bid Amount"
                                        name="bidAmount"
                                        type="number"
                                        placeholder={`Min: ${minimumBidAmount.toLocaleString()}`}
                                        value={bidAmount}
                                        onChange={(e) => setBidAmount(e.target.value)}
                                        min={minimumBidAmount}
                                    />
                                </div>
                                <div className="text-[10px] text-gray-500 flex items-center space-x-1">
                                    <Info className="h-2.5 w-2.5" />
                                    <span>Minimum bid: ₹{minimumBidAmount}</span>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="space-y-1">
                            {/* Auto bidding buttons */}
                            {isAutomaticBidding && !isAutoBidEnabled && (
                                <button
                                    onClick={handleEnableAutoBid}
                                    disabled={!automaticBidIncrement || Number(automaticBidIncrement) <= 0 || settingBidMode}
                                    className={`w-full py-2 px-6 rounded-lg font-medium text-md duration-300 flex items-center justify-center space-x-3 shadow-lg ${!automaticBidIncrement || Number(automaticBidIncrement) <= 0 || settingBidMode
                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none'
                                        : 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
                                        }`}
                                >
                                    {settingBidMode ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    ) : (
                                        <Gavel className="h-6 w-6" />
                                    )}
                                    <span>
                                        {settingBidMode ? 'Enabling Auto Bid...' : 'Enable Auto Bid'}
                                    </span>
                                </button>
                            )}

                            {/* Place bid button (shows for manual or when auto is enabled) */}
                            {(!isAutomaticBidding || isAutoBidEnabled) && (
                                <button
                                    onClick={handleSubmitBid}
                                    disabled={isSubmitDisabled || placingBid}
                                    className={`w-full py-2 px-6 rounded-lg font-medium text-md duration-300 flex items-center justify-center space-x-3 shadow-lg ${isSubmitDisabled || placingBid
                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none'
                                        : 'bg-green-500 text-white hover:bg-green-600 cursor-pointer'
                                        }`}
                                >
                                    {placingBid ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    ) : (
                                        <Gavel className="h-6 w-6" />
                                    )}
                                    <span>
                                        {placingBid ? 'Placing Bid...' : 'Place Bid'}
                                    </span>
                                </button>
                            )}

                            <div className="text-center">
                                <p className="text-[8px] text-gray-500">
                                    {isAutomaticBidding
                                        ? isAutoBidEnabled
                                            ? `Your bid: ₹${(currentHighestBid + Number(automaticBidIncrement)).toLocaleString()}`
                                            : 'Enter increment amount and enable auto-bidding'
                                        : 'Your bid must be higher than the current price'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DesktopBidPlacement;