import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProductDetails from "./ProductDetails";
import BidHistory from "./BidHistory";
import { AppDispatch, RootState } from "../../../State/store";
import { fetchSpecificProduct, getAllBids, placeBid } from "../../../Services/biddingActions";
import { BiddingStatus, BidType } from "../../../utils/enum";
import BidPlacement from "./BidPlacement";
import { adjustTimestampForIST, calculateTimeRemaining } from "../../../utils/dateTime/dateFormatter";

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
    bidType: BidType
}

interface BiddingProps {
    productId?: string;
}

const Bidding = ({ productId: propProductId }: BiddingProps) => {

    const { productId: urlProductId } = useParams<{ productId: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const productId = propProductId || urlProductId;
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(false);
    const [biddingStatus, setBiddingStatus] = useState<BiddingStatus>(BiddingStatus.NOT_STARTED);
    const [timeRemaining, setTimeRemaining] = useState<string>("00:00:00");
    const [isMobile, setIsMobile] = useState(false);

    const {
        currentProduct: product,
        loading,
        bids: reduxBids,
        fetchingBids,
        placingBid
    } = useSelector((state: RootState) => state.bidding);

    // Check screen size on component mount and window resize
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 1024); // lg breakpoint
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Updated formatBids function to match BidHistory interface
    const formatBids = (apiBids: any[]): Bid[] => {
        return apiBids.map((bid, index) => {
            return {
                bidId: bid.bidId,
                productId: bid.productId,
                bidderId: bid.bidderId,
                bidderName: bid.bidderName,
                bidderInitials: bid.bidderName.substring(0, 2).toUpperCase(),
                currentBidAmount: bid.currentBidAmount,
                previousBidAmount: bid.previousBidAmount,
                incrementAmount: bid.incrementAmount,
                bidTime: bid.bidTime,
                timeAgo: bid.timeAgo,
                isWinningBid: index === 0,
                bidStatus: bid.bidStatus,
                bidType: bid.bidType === "AUTO" ? BidType.AUTO : BidType.MANUAL
            };
        });
    };

    // Function to determine bidding status based on start and end times
    const determineBiddingStatus = (product: any): BiddingStatus => {
        if (!product?.bidStartTime || !product?.bidEndTime) {
            return BiddingStatus.NOT_STARTED;
        }

        const now = new Date();
        const startTime = adjustTimestampForIST(product.bidStartTime);
        const endTime = adjustTimestampForIST(product.bidEndTime);

        if (now < startTime) {
            return BiddingStatus.NOT_STARTED;
        } else if (now >= startTime && now < endTime) {
            return BiddingStatus.ACTIVE;
        } else {
            return BiddingStatus.ENDED;
        }
    };

    // useEffect for bidding status and time remaining
    useEffect(() => {
        if (!product) return;

        const updateStatus = () => {
            const status = determineBiddingStatus(product);
            // console.log("Bidding Status:", status);
            setBiddingStatus(status);

            if (status === BiddingStatus.NOT_STARTED) {
                // Time remaining until bidding starts
                const timeUntilStart = calculateTimeRemaining(product.bidStartTime);
                setTimeRemaining(timeUntilStart);
            } else if (status === BiddingStatus.ACTIVE) {
                // Time remaining until bidding ends
                const timeUntilEnd = calculateTimeRemaining(product.bidEndTime);
                setTimeRemaining(timeUntilEnd);
            } else {
                // Bidding has ended
                setTimeRemaining("00:00:00");
            }
        };

        updateStatus();
        const interval = setInterval(updateStatus, 1000);

        return () => clearInterval(interval);
    }, [product]);

    // Fetch product details and bids when component mounts or productId changes
    useEffect(() => {
        if (productId) {
            dispatch(fetchSpecificProduct(productId));
            dispatch(getAllBids(productId));
        }
    }, [dispatch, productId]);

    // Auto-refresh bids when bidding is active
    useEffect(() => {
        if (biddingStatus === BiddingStatus.ACTIVE && productId && autoRefreshEnabled) {
            const interval = setInterval(() => {
                dispatch(getAllBids(productId));
            }, 3000); // Refresh every 3 seconds when auto-refresh is enabled

            return () => clearInterval(interval);
        }
    }, [biddingStatus, productId, dispatch, autoRefreshEnabled]);

    // Reset auto-refresh when bidding is not active
    useEffect(() => {
        if (biddingStatus !== BiddingStatus.ACTIVE) {
            setAutoRefreshEnabled(false);
        }
    }, [biddingStatus]);

    const handlePlaceBidClick = () => {
        if (biddingStatus === BiddingStatus.ACTIVE) {
            setIsBottomSheetOpen(true);
        }
    };

    const handleCloseBidSheet = () => {
        setIsBottomSheetOpen(false);
    };

    const handleSubmitBid = async (bidData: { amount: string; isAutomatic: boolean; increment?: string }) => {
        if (!productId) return;

        try {
            let bidRequest;

            if (bidData.isAutomatic) {
                bidRequest = {};
            } else {
                bidRequest = {
                    bidAmount: Number(bidData.amount),
                };
            }

            await dispatch(placeBid(productId, bidRequest));
            dispatch(getAllBids(productId));
            setIsBottomSheetOpen(false);
        } catch (error) {
            console.error('Error placing bid:', error);
        }
    };

    const handleRefreshBids = () => {
        if (productId) {
            dispatch(getAllBids(productId));
        }
    };

    const handleAutoRefreshToggle = (enabled: boolean) => {
        setAutoRefreshEnabled(enabled);
    };

    // Format bids
    const formattedBids = reduxBids ? formatBids(reduxBids) : [];

    // Loading state
    if (loading) {
        return (
            <>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading product details...</p>
                    </div>
                </div>
            </>
        );
    }

    // No product found
    if (!product) {
        return (
            <>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Product Not Found</h2>
                        <p className="text-gray-600">The requested product could not be found.</p>
                    </div>
                </div>
            </>
        );
    }

    // Render mobile layout
    if (isMobile) {
        return (
            <>
                <div className="min-h-screen">
                    <div className="max-w-9xl mx-auto px-4 py-6">
                        <div className="space-y-4">
                            <ProductDetails product={product} />
                            <BidHistory
                                bids={formattedBids}
                                onPlaceBidClick={handlePlaceBidClick}
                                onRefreshBids={handleRefreshBids}
                                biddingStatus={biddingStatus}
                                timeRemaining={timeRemaining}
                                loading={fetchingBids}
                                totalBids={formattedBids.length}
                                highestBid={formattedBids.length > 0 ? formattedBids[0].currentBidAmount : 0}
                                startingPrice={product?.startingPrice}
                                autoRefreshEnabled={autoRefreshEnabled}
                                onAutoRefreshToggle={handleAutoRefreshToggle}
                            />
                            {biddingStatus === BiddingStatus.ACTIVE && (
                                <BidPlacement
                                    bids={formattedBids}
                                    isBottomSheetOpen={isBottomSheetOpen}
                                    onCloseBidSheet={handleCloseBidSheet}
                                    onSubmitBid={handleSubmitBid}
                                    biddingStatus={biddingStatus}
                                    timeRemaining={timeRemaining}
                                    loading={placingBid}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </>
        )
    }

    // Render desktop layout
    return (
        <>
            <div className="min-h-screen">
                <div className="max-w-9xl mx-auto px-4 py-6">
                    <div className="grid grid-cols-3 gap-4">
                        {/* Left Column - Product Details */}
                        <div className="col-span-2">
                            <div className="space-y-4">
                                <ProductDetails product={product} />
                                <BidHistory
                                    bids={formattedBids}
                                    onPlaceBidClick={handlePlaceBidClick}
                                    onRefreshBids={handleRefreshBids}
                                    biddingStatus={biddingStatus}
                                    timeRemaining={timeRemaining}
                                    loading={fetchingBids}
                                    totalBids={formattedBids.length}
                                    highestBid={formattedBids.length > 0 ? formattedBids[0].currentBidAmount : 0}
                                    startingPrice={product?.startingPrice}
                                    autoRefreshEnabled={autoRefreshEnabled}
                                    onAutoRefreshToggle={handleAutoRefreshToggle}
                                />
                            </div>
                        </div>

                        {/* Right Column - Bid Placement */}
                        <div className="col-span-1">
                            <BidPlacement
                                bids={formattedBids}
                                isBottomSheetOpen={isBottomSheetOpen}
                                onCloseBidSheet={handleCloseBidSheet}
                                onSubmitBid={handleSubmitBid}
                                biddingStatus={biddingStatus}
                                timeRemaining={timeRemaining}
                                loading={placingBid}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};

export default Bidding;