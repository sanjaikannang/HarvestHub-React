import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Gavel, Info, X } from "lucide-react";
import { AppDispatch, RootState } from "../../../State/store";
import { setBidMode, getBidMode } from "../../../Services/biddingActions";
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
    bidType: "MANUAL" | "AUTO";
}

interface BidPlacementProps {
    bids: Bid[];
    isBottomSheetOpen: boolean;
    onCloseBidSheet: () => void;
    onSubmitBid: (bidData: { amount: string; isAutomatic: boolean; increment?: string }) => Promise<void>;
    biddingStatus: BiddingStatus;
    timeRemaining: string;
    loading: boolean;
}

const BidPlacement = ({
    bids,
    isBottomSheetOpen,
    onCloseBidSheet,
    onSubmitBid,
    biddingStatus,
    timeRemaining,
}: BidPlacementProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const {
        placingBid,
        settingBidMode,
        fetchingBidMode,
        currentBidMode,
        currentProduct,
        error
    } = useSelector((state: RootState) => state.bidding);

    const [bidAmount, setBidAmount] = useState("");
    const [isAutomaticBidding, setIsAutomaticBidding] = useState(false);
    const [automaticBidIncrement, setAutomaticBidIncrement] = useState("100");
    const [maxAutoBidAmount, setMaxAutoBidAmount] = useState("");

    // Get current product ID
    const productId = currentProduct?._id;

    // Fetch bid mode when component mounts
    useEffect(() => {
        if (productId) {
            dispatch(getBidMode(productId));
        }
    }, [dispatch, productId]);

    // Update local state when bid mode is fetched
    useEffect(() => {
        if (currentBidMode) {
            setIsAutomaticBidding(currentBidMode.bidMode === "AUTO"); // Changed from bidType to bidMode
            if (currentBidMode.bidMode === "AUTO") {
                setAutomaticBidIncrement(currentBidMode.autoIncrementAmount?.toString() || "100"); // Changed from incrementAmount to autoIncrementAmount
            }
        }
    }, [currentBidMode]);

    const handleSubmitBid = async () => {
        if (!productId) return;

        try {
            if (isAutomaticBidding) {
                // First set the bid mode to automatic
                await dispatch(setBidMode(productId, {
                    bidMode: "AUTO", // Changed from bidType to bidMode
                    autoIncrementAmount: Number(automaticBidIncrement)
                }));

                // Then place the initial bid
                await onSubmitBid({
                    amount: (currentHighestBid + Number(automaticBidIncrement)).toString(),
                    isAutomatic: true,
                    increment: automaticBidIncrement
                });
            } else {
                // Set bid mode to manual first
                await dispatch(setBidMode(productId, {
                    bidMode: "MANUAL" // Changed from bidType to bidMode
                }));

                // Then place the manual bid using the prop function
                await onSubmitBid({
                    amount: bidAmount,
                    isAutomatic: false
                });
            }

            // Reset form on success
            if (!error) {
                setBidAmount("");
                setIsAutomaticBidding(false);
                setAutomaticBidIncrement("100");
                setMaxAutoBidAmount("");
                onCloseBidSheet();
            }
        } catch (error) {
            console.error('Error placing bid:', error);
        }
    };

    const handleBidModeChange = async (isAuto: boolean) => {
        if (!productId) return;

        setIsAutomaticBidding(isAuto);

        // Update bid mode on server
        try {
            if (isAuto) {
                await dispatch(setBidMode(productId, {
                    bidMode: "AUTO", // Changed from bidType to bidMode
                    autoIncrementAmount: Number(automaticBidIncrement || 100) // Changed from incrementAmount to autoIncrementAmount
                }));
            } else {
                await dispatch(setBidMode(productId, {
                    bidMode: "MANUAL" // Changed from bidType to bidMode
                }));
            }
        } catch (error) {
            console.error('Error setting bid mode:', error);
            // Revert the state change on error
            setIsAutomaticBidding(!isAuto);
        }
    };

    const currentHighestBid = bids.length > 0 ? bids[0].currentBidAmount : (currentProduct?.startingPrice || 0);
    const minimumBidAmount = currentHighestBid + 1;

    const isSubmitDisabled = isAutomaticBidding
        ? !automaticBidIncrement || Number(automaticBidIncrement) <= 0 || !maxAutoBidAmount || Number(maxAutoBidAmount) <= currentHighestBid
        : !bidAmount || Number(bidAmount) <= currentHighestBid;

    const isBiddingActive = biddingStatus === BiddingStatus.ACTIVE;

    return (
        <>
            {/* Desktop Sidebar */}
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
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-3 hidden lg:block backdrop-blur-sm">
                    {/* Header with enhanced styling */}
                    <div className="flex items-center justify-center mb-4">
                        <div className="flex items-center">
                            <h3 className="text-xl font-semibold text-gray-900">Place Your Bid</h3>
                            {fetchingBidMode && (
                                <div className="ml-2 animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
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
                                    <label className={`flex items-center justify-center rounded-lg border cursor-pointer transition-all duration-200 ${!isAutomaticBidding
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

                                    <label className={`flex items-center justify-center rounded-lg border cursor-pointer transition-all duration-200 ${isAutomaticBidding
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
                                <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200 p-3 shadow-sm">
                                    <div className="flex items-center space-x-2 mb-3">
                                        <Info className="h-4 w-4 text-emerald-600" />
                                        <span className="text-sm font-semibold text-emerald-800">Auto-Bid Configuration</span>
                                    </div>

                                    <div className="space-y-3">
                                        <Input
                                            id="incrementAmount"
                                            label="Increment Amount"
                                            name="incrementAmount"
                                            type="number"
                                            value={automaticBidIncrement}
                                            onChange={(e) => setAutomaticBidIncrement(e.target.value)}
                                            placeholder="100"
                                            min={minimumBidAmount}
                                        />
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

                            {/* Enhanced Submit Button */}
                            <div className="space-y-1">
                                <button
                                    onClick={handleSubmitBid}
                                    disabled={isSubmitDisabled || placingBid || settingBidMode}
                                    className={`w-full py-2 px-6 rounded-lg font-medium text-md duration-300 flex items-center justify-center space-x-3 shadow-lg ${isSubmitDisabled || placingBid || settingBidMode
                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none'
                                        : 'bg-green-500 text-white hover:bg-green-600 cursor-pointer'
                                        }`}
                                >
                                    {placingBid || settingBidMode ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    ) : (
                                        <Gavel className="h-6 w-6" />
                                    )}
                                    <span>
                                        {placingBid ? 'Placing Bid...' :
                                            settingBidMode ? 'Setting Mode...' :
                                                isAutomaticBidding ? 'Enable Auto Bid' : 'Place Bid'}
                                    </span>
                                </button>

                                <div className="text-center">
                                    <p className="text-[8px] text-gray-500">
                                        {isAutomaticBidding
                                            ? 'Auto-bidding will activate when someone outbids you'
                                            : 'Your bid must be higher than the current price'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Sheet for Mobile Bid Placement */}
            {isBottomSheetOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                        onClick={onCloseBidSheet}
                    />

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
                                                    disabled={settingBidMode}
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
                                                    disabled={settingBidMode}
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
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Maximum Bid Amount (₹)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={maxAutoBidAmount}
                                                        onChange={(e) => setMaxAutoBidAmount(e.target.value)}
                                                        placeholder="10,000"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                                                        min={currentHighestBid + 1}
                                                    />
                                                </div>
                                                <div className="bg-white rounded-lg p-3 border border-emerald-100">
                                                    <div className="flex justify-between items-center text-xs">
                                                        <span className="text-gray-600">Your next bid:</span>
                                                        <span className="font-bold text-emerald-700">
                                                            ₹{(currentHighestBid + Number(automaticBidIncrement || 0)).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-xs mt-1">
                                                        <span className="text-gray-600">Maximum you'll pay:</span>
                                                        <span className="font-bold text-red-600">
                                                            ₹{Number(maxAutoBidAmount || 0).toLocaleString()}
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
                                        onClick={handleSubmitBid}
                                        disabled={isSubmitDisabled || placingBid || settingBidMode}
                                        className={`w-full py-3 px-6 rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 ${isSubmitDisabled || placingBid || settingBidMode
                                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 shadow-lg hover:shadow-xl'
                                            }`}
                                    >
                                        {placingBid || settingBidMode ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        ) : (
                                            <Gavel className="h-5 w-5" />
                                        )}
                                        <span>
                                            {placingBid ? 'Placing Bid...' :
                                                settingBidMode ? 'Setting Mode...' :
                                                    isAutomaticBidding ? 'Enable Auto-Bidding' : 'Place Bid Now'}
                                        </span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default BidPlacement;