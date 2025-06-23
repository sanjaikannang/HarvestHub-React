import { useState, useEffect } from "react";
import ProductDetails from "./ProductDetails";
import BidHistory from "./BidHistory";
import BidPlacement from "./BidPlacement";

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

const Bidding = ({ productId }: BiddingProps) => {
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    const [bids, setBids] = useState<Bid[]>([]);
    const [product, setProduct] = useState<Product | null>(null);

    // Sample product data - replace with actual API call
    useEffect(() => {
        // Simulate API call to fetch product details
        const sampleProduct: Product = {
            name: "Premium Organic Tomatoes",
            description: "Fresh, locally grown organic tomatoes harvested at peak ripeness. These premium quality tomatoes are perfect for cooking, salads, and preserving. Grown without pesticides using sustainable farming practices.",
            category: "Vegetables",
            farmer: "Rajesh Kumar",
            location: "Bangalore, Karnataka",
            quantity: "500 kg",
            quality: "Grade A",
            harvestDate: "2025-06-20",
            currentPrice: 15000,
            imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            isActive: true
        };

        setProduct(sampleProduct);
    }, [productId]);

    // Sample bid data - replace with actual API call
    useEffect(() => {
        const sampleBids: Bid[] = [
            {
                id: 1,
                userName: "Arjun Patel",
                userAvatar: "AP",
                amount: 15500,
                previousAmount: 15000,
                timestamp: "2 min ago",
                fullTimestamp: "June 23, 2025 at 2:30 PM",
                bidType: "Manual Bid",
                verificationStatus: "verified",
                isHighest: true,
                isNewBid: true
            },
            {
                id: 2,
                userName: "Priya Sharma",
                userAvatar: "PS",
                amount: 15000,
                previousAmount: 14500,
                timestamp: "5 min ago",
                fullTimestamp: "June 23, 2025 at 2:27 PM",
                bidType: "Auto Bid",
                verificationStatus: "verified",
                isHighest: false,
                isNewBid: false
            },
            {
                id: 3,
                userName: "Vikram Singh",
                userAvatar: "VS",
                amount: 14500,
                previousAmount: 14000,
                timestamp: "8 min ago",
                fullTimestamp: "June 23, 2025 at 2:24 PM",
                bidType: "Manual Bid",
                verificationStatus: "unverified",
                isHighest: false,
                isNewBid: false
            },
            {
                id: 4,
                userName: "Meera Reddy",
                userAvatar: "MR",
                amount: 14000,
                previousAmount: 13500,
                timestamp: "12 min ago",
                fullTimestamp: "June 23, 2025 at 2:20 PM",
                bidType: "Manual Bid",
                verificationStatus: "verified",
                isHighest: false,
                isNewBid: false
            },
            {
                id: 5,
                userName: "Rohit Gupta",
                userAvatar: "RG",
                amount: 13500,
                previousAmount: 13000,
                timestamp: "15 min ago",
                fullTimestamp: "June 23, 2025 at 2:17 PM",
                bidType: "Auto Bid",
                verificationStatus: "verified",
                isHighest: false,
                isNewBid: false
            }
        ];

        setBids(sampleBids);
    }, [productId]);

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

        // Here you would typically make an API call to submit the bid
        console.log('Bid submitted:', bidData);
    };

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading product details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-6">
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