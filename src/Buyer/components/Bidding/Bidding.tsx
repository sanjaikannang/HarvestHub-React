import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProductDetails from "./ProductDetails";
import BidHistory from "./BidHistory";
import BidPlacement from "./BidPlacement";
import { AppDispatch, RootState } from "../../../State/store";
import { fetchSpecificProduct, getAllBids } from "../../../Services/biddingActions";

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

interface BiddingProps {
    productId?: string;
}

const Bidding = ({ productId: propProductId }: BiddingProps) => {
    const { productId: urlProductId } = useParams<{ productId: string }>();
    const dispatch = useDispatch<AppDispatch>();

    // Get the product ID from props or URL params
    const productId = propProductId || urlProductId;

    // Redux state
    const {
        currentProduct: product,
        loading,
        error,
    } = useSelector((state: RootState) => state.bidding);

    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    const [bids, setBids] = useState<Bid[]>([]);

    // Fetch product details when component mounts or productId changes
    useEffect(() => {
        if (productId) {
            dispatch(fetchSpecificProduct(productId));
            dispatch(getAllBids(productId));
        }
    }, [dispatch, productId]);

    const handlePlaceBidClick = () => {
        setIsBottomSheetOpen(true);
    };

    const handleCloseBidSheet = () => {
        setIsBottomSheetOpen(false);
    };

    const handleSubmitBid = (bidData: { amount: string; isAutomatic: boolean; increment?: string }) => {
        const newBid: Bid = {
            id: Date.now(),
            userName: "You",
            userAvatar: "YU",
            amount: Number(bidData.amount),
            previousAmount: bids[0]?.amount || 0,
            timestamp: "Just now",
            fullTimestamp: new Date().toLocaleString(),
            bidType: bidData.isAutomatic ? "Auto Bid" : "Manual Bid",
            verificationStatus: "verified",
            isHighest: true,
            isNewBid: true
        };

        // Update all existing bids to not be highest or new
        const updatedBids = bids.map(bid => ({
            ...bid,
            isHighest: false,
            isNewBid: false
        }));

        // Add new bid to the top
        setBids([newBid, ...updatedBids]);

        // Close the bottom sheet
        setIsBottomSheetOpen(false);

        // TODO: Integrate with placeBid action
        // dispatch(placeBid(productId!, { bidAmount: Number(bidData.amount) }));
        console.log('Bid submitted:', bidData);
    };


    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading product details...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                        <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Product</h2>
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={() => productId && dispatch(fetchSpecificProduct(productId))}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // No product found
    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Product Not Found</h2>
                    <p className="text-gray-600">The requested product could not be found.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-9xl mx-auto px-4 py-6">
                {/* Mobile Layout */}
                <div className="lg:hidden space-y-4">
                    <ProductDetails product={product} />
                    <BidHistory bids={bids} onPlaceBidClick={handlePlaceBidClick} />
                    <BidPlacement
                        bids={bids}
                        isBottomSheetOpen={isBottomSheetOpen}
                        onCloseBidSheet={handleCloseBidSheet}
                        onSubmitBid={handleSubmitBid}
                    />
                </div>

                {/* Desktop Layout */}
                <div className="hidden lg:grid lg:grid-cols-3 lg:gap-4">
                    {/* Left Column - Product Details */}
                    <div className="lg:col-span-2">
                        <div className="space-y-4">
                            <ProductDetails product={product} />
                            <BidHistory bids={bids} onPlaceBidClick={handlePlaceBidClick} />
                        </div>
                    </div>

                    {/* Right Column - Bid Placement */}
                    <div className="lg:col-span-1">
                        <BidPlacement
                            bids={bids}
                            isBottomSheetOpen={isBottomSheetOpen}
                            onCloseBidSheet={handleCloseBidSheet}
                            onSubmitBid={handleSubmitBid}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Bidding;