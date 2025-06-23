import { useState } from "react";
import { Gavel, Info, X } from "lucide-react";

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

interface BidPlacementProps {
    bids: Bid[];
    isBottomSheetOpen: boolean;
    onCloseBidSheet: () => void;
    onSubmitBid: (bidData: { amount: string; isAutomatic: boolean; increment?: string }) => void;
}

const BidPlacement = ({
    bids,
    isBottomSheetOpen,
    // onCloseBidSheet,
    onSubmitBid
}: BidPlacementProps) => {
    const [bidAmount, setBidAmount] = useState("");
    const [isAutomaticBidding, setIsAutomaticBidding] = useState(false);
    const [automaticBidIncrement, setAutomaticBidIncrement] = useState("100");

    const handleSubmitBid = () => {
        if (isAutomaticBidding) {
            const newBidAmount = (bids[0]?.amount || 0) + Number(automaticBidIncrement);
            onSubmitBid({
                amount: newBidAmount.toString(),
                isAutomatic: true,
                increment: automaticBidIncrement
            });
        } else {
            onSubmitBid({
                amount: bidAmount,
                isAutomatic: false
            });
        }

        // Reset form
        setBidAmount("");
        setIsAutomaticBidding(false);
        setAutomaticBidIncrement("100");
    };

    const isSubmitDisabled = isAutomaticBidding
        ? !automaticBidIncrement || Number(automaticBidIncrement) <= 0
        : !bidAmount || Number(bidAmount) <= (bids[0]?.amount || 0);

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="lg:sticky lg:top-20 lg:h-fit space-y-4">
                {/* Current Price & Timer */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hidden lg:block">
                    <div className="text-center space-y-4">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Time Remaining</p>
                            <p className="text-xl font-mono font-bold text-gray-900">
                                02:45:32
                            </p>
                        </div>
                    </div>
                </div>

                {/* Desktop Place Bid */}
                <div className="bg-gradient-to-br from-white via-gray-50 to-blue-50 rounded-2xl shadow-xl border border-gray-200 p-3 hidden lg:block backdrop-blur-sm">
                    {/* Header with enhanced styling */}
                    <div className="flex items-center justify-center mb-4">
                        <div className="flex items-center">
                            <h3 className="text-xl font-semibold text-gray-900">Place Your Bid</h3>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Bidding Mode Toggle with enhanced design */}
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <label className={`relative flex items-center justify-center rounded-lg border cursor-pointer transition-all duration-200 ${!isAutomaticBidding
                                    ? 'border-emerald-500 bg-emerald-50 shadow-md'
                                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="desktopBiddingMode"
                                        checked={!isAutomaticBidding}
                                        onChange={() => setIsAutomaticBidding(false)}
                                        className="sr-only"
                                    />
                                    <div className="text-center">
                                        <div className={`text-xs font-medium ${!isAutomaticBidding ? 'text-emerald-700' : 'text-gray-700'}`}>
                                            Manual Bidding
                                        </div>
                                        <div className={`text-[9px] mt-0.5 ${!isAutomaticBidding ? 'text-emerald-600' : 'text-gray-500'}`}>
                                            Full control
                                        </div>
                                    </div>
                                    {!isAutomaticBidding && (
                                        <div className="absolute top-2 right-2 w-3 h-3 bg-emerald-500 rounded-full"></div>
                                    )}
                                </label>

                                <label className={`relative flex items-center justify-center p-2 rounded-xl border-2 cursor-pointer transition-all duration-200 ${isAutomaticBidding
                                    ? 'border-emerald-500 bg-emerald-50 shadow-md'
                                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="desktopBiddingMode"
                                        checked={isAutomaticBidding}
                                        onChange={() => setIsAutomaticBidding(true)}
                                        className="sr-only"
                                    />
                                    <div className="text-center">
                                        <div className={`text-xs font-medium ${isAutomaticBidding ? 'text-emerald-700' : 'text-gray-700'}`}>
                                            Auto Bidding
                                        </div>
                                        <div className={`text-[9px] mt-0.5 ${isAutomaticBidding ? 'text-emerald-600' : 'text-gray-500'}`}>
                                            Set & forget
                                        </div>
                                    </div>
                                    {isAutomaticBidding && (
                                        <div className="absolute top-2 right-2 w-3 h-3 bg-emerald-500 rounded-full"></div>
                                    )}
                                </label>
                            </div>
                        </div>

                        {/* Automatic Bidding Settings with enhanced design */}
                        {isAutomaticBidding && (
                            <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200 p-2 shadow-sm">
                                <div className="flex items-center space-x-2 mb-3">
                                    <Info className="h-4 w-4 text-emerald-600" />
                                    <span className="text-sm font-semibold text-emerald-800">Auto-Bid Configuration</span>
                                </div>

                                <div className="space-y-1">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Increment Amount (₹)
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₹</span>
                                            <input
                                                type="number"
                                                value={automaticBidIncrement}
                                                onChange={(e) => setAutomaticBidIncrement(e.target.value)}
                                                placeholder="1,000"
                                                className="w-full pl-8 pr-4 py-2 border-2 border-gray-300 rounded-lg text-sm font-medium transition-all duration-200"
                                                min="1"
                                            />
                                        </div>
                                    </div>

                                    <div className="px-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-600">Your next bid will be:</span>
                                            <span className="text-xs font-bold text-emerald-700">
                                                ₹{((bids[0]?.amount || 0) + Number(automaticBidIncrement || 0)).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Manual Bid Input with enhanced design */}
                        {!isAutomaticBidding && (
                            <div className="space-y-1">
                                <label className="block text-sm font-semibold text-gray-800">
                                    Your Bid Amount
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold text-lg">₹</span>
                                    <input
                                        type="number"
                                        value={bidAmount}
                                        onChange={(e) => setBidAmount(e.target.value)}
                                        placeholder={`Min: ${((bids[0]?.amount || 0) + 1).toLocaleString()}`}
                                        className="w-full pl-10 pr-4 py-1.5 border-2 border-gray-300 rounded-lg text-lg font-semibold"
                                        min={(bids[0]?.amount || 0) + 1}
                                    />
                                </div>
                                <div className="text-xs text-gray-500 flex items-center space-x-1">
                                    <Info className="h-3 w-3" />
                                    <span>Minimum bid: ₹{((bids[0]?.amount || 0) + 1).toLocaleString()}</span>
                                </div>
                            </div>
                        )}

                        {/* Enhanced Submit Button */}
                        <div className="space-y-1">
                            <button
                                onClick={handleSubmitBid}
                                disabled={isSubmitDisabled}
                                className={`w-full py-2 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg ${isSubmitDisabled
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none'
                                    : 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 hover:shadow-xl cursor-pointer'
                                    }`}
                            >
                                <Gavel className="h-6 w-6" />
                                <span>{isAutomaticBidding ? 'Enable Auto-Bidding' : 'Place Bid Now'}</span>
                            </button>

                            <div className="text-center">
                                <p className="text-[10px] text-gray-500">
                                    {isAutomaticBidding
                                        ? 'Auto-bidding will activate when someone outbids you'
                                        : 'Your bid must be higher than the current price'
                                    }
                                </p>                             
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Sheet for Mobile Bid Placement */}
            {isBottomSheetOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-opacity-50 z-40 lg:hidden"
                    //onClick={handleCloseBidSheet}
                    />

                    {/* Bottom Sheet */}
                    <div className="border border-gray-300 fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 lg:hidden transform transition-transform duration-300 ease-out">
                        {/* Header */}
                        <div className="px-4 py-3">
                            <div className="flex justify-center items-center relative">
                                <h3 className="text-lg text-gray-900 flex items-center space-x-2">
                                    Place Your Bid
                                </h3>
                                <button
                                    //onClick={handleCloseBidSheet}
                                    className="absolute right-0 p-1 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <X className="h-5 w-5 text-gray-500" />
                                </button>
                            </div>
                        </div>

                        <div className="px-2">
                            <div className="border-t border-gray-300"></div>
                        </div>

                        {/* Content */}
                        <div className="p-4 pb-6">
                            {/* Bidding Mode Toggle */}
                            <div className="mb-4">
                                <div className="flex items-center space-x-4">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="biddingMode"
                                            checked={!isAutomaticBidding}
                                            onChange={() => setIsAutomaticBidding(false)}
                                            className="text-green-500 focus:ring-green-500"
                                        />
                                        <span className="text-sm text-gray-700">
                                            Manual Bidding
                                        </span>
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="biddingMode"
                                            checked={isAutomaticBidding}
                                            onChange={() => setIsAutomaticBidding(true)}
                                            className="text-green-500 focus:ring-green-500"
                                        />
                                        <span className="text-sm text-gray-700">
                                            Automatic Bidding
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Automatic Bidding Settings */}
                            {isAutomaticBidding && (
                                <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                                    <p className="text-sm text-gray-700 mb-2">
                                        Set the amount to add to the current highest bid:
                                    </p>
                                    <input
                                        type="number"
                                        value={automaticBidIncrement}
                                        onChange={(e) => setAutomaticBidIncrement(e.target.value)}
                                        placeholder="100"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                                        min="1"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Your bid will be: ₹
                                        {(
                                            (bids[0]?.amount || 0) +
                                            Number(automaticBidIncrement || 0)
                                        ).toLocaleString()}
                                    </p>
                                </div>
                            )}

                            {/* Bid Input and Button in the Same Line */}
                            <div className="flex items-center space-x-4">
                                {/* Input - Only show for manual bidding */}
                                {!isAutomaticBidding && (
                                    <div className="flex-1">
                                        <input
                                            type="number"
                                            value={bidAmount}
                                            onChange={(e) => setBidAmount(e.target.value)}
                                            placeholder={`Min: ₹${(
                                                bids[0]?.amount + 1
                                            ).toLocaleString()}`}
                                            className="w-full px-4 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg"
                                            min={bids[0]?.amount + 1}
                                        />
                                    </div>
                                )}

                                {/* Button */}
                                <button
                                    //onClick={handleAutomaticBidSubmit}
                                    disabled={
                                        isAutomaticBidding
                                            ? !automaticBidIncrement ||
                                            Number(automaticBidIncrement) <= 0
                                            : !bidAmount || Number(bidAmount) <= bids[0]?.amount
                                    }
                                    className={`bg-green-500 text-white py-1.5 px-4 rounded-lg hover:bg-green-600 flex items-center justify-center space-x-2 text-lg font-medium whitespace-nowrap ${isAutomaticBidding ? "flex-1" : ""
                                        }`}
                                >
                                    <Gavel className="h-5 w-5" />
                                    <span>Place Bid</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default BidPlacement;