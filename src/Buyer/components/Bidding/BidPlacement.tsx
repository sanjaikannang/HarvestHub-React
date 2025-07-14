import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../State/store";
import { setBidMode, getBidMode } from "../../../Services/biddingActions";
import { BiddingStatus, BidType } from "../../../utils/enum";
import DesktopBidPlacement from "./DesktopBidPlacement";
import MobileBidPlacement from "./MobileBidPlacement";

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
    const [bidAmount, setBidAmount] = useState("");
    const [isAutomaticBidding, setIsAutomaticBidding] = useState(false);
    const [automaticBidIncrement, setAutomaticBidIncrement] = useState("100");
    const [isAutoBidEnabled, setIsAutoBidEnabled] = useState(false);

    const {
        placingBid,
        settingBidMode,
        fetchingBidMode,
        currentBidMode,
        currentProduct,
        error
    } = useSelector((state: RootState) => state.bidding);

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
            const isAutoMode = currentBidMode.bidMode === BidType.AUTO;
            setIsAutomaticBidding(isAutoMode);
            setIsAutoBidEnabled(isAutoMode);
            if (isAutoMode) {
                setAutomaticBidIncrement(currentBidMode.autoIncrementAmount?.toString() || "100");
            }
        }
    }, [currentBidMode]);

    const currentHighestBid = bids.length > 0 ? bids[0].currentBidAmount : (currentProduct?.startingPrice || 0);
    const minimumBidAmount = currentHighestBid + 1;

    const handleEnableAutoBid = async () => {
        if (!productId || !automaticBidIncrement) return;

        try {
            // Set the bid mode to automatic with increment amount
            await dispatch(setBidMode(productId, {
                bidMode: BidType.AUTO,
                autoIncrementAmount: Number(automaticBidIncrement)
            }));

            setIsAutoBidEnabled(true);
        } catch (error) {
            console.error('Error enabling auto bid:', error);
        }
    };

    const handleSubmitBid = async () => {
        if (!productId) return;

        try {
            if (isAutomaticBidding && isAutoBidEnabled) {
                // For automatic bidding, don't send amount - just call the API
                await onSubmitBid({
                    amount: "", // Empty amount for auto-bidding
                    isAutomatic: true,
                    increment: automaticBidIncrement
                });
            } else {
                // Manual bidding - set bid mode to manual first
                await dispatch(setBidMode(productId, {
                    bidMode: BidType.MANUAL
                }));

                // Then place the manual bid
                await onSubmitBid({
                    amount: bidAmount,
                    isAutomatic: false
                });
            }

            // Reset form on success for manual bidding
            if (!isAutomaticBidding && !error) {
                setBidAmount("");
                onCloseBidSheet();
            }
        } catch (error) {
            console.error('Error placing bid:', error);
        }
    };

    const handleBidModeChange = (isAuto: boolean) => {
        setIsAutomaticBidding(isAuto);
        if (!isAuto) {
            setIsAutoBidEnabled(false);
        }
    };

    const handleDisableAutoBid = async () => {
        if (!productId) return;

        try {
            await dispatch(setBidMode(productId, {
                bidMode: BidType.MANUAL
            }));
            setIsAutoBidEnabled(false);
        } catch (error) {
            console.error('Error disabling auto bid:', error);
        }
    };

    // For manual bidding
    const isManualSubmitDisabled = !isAutomaticBidding && (!bidAmount || Number(bidAmount) <= currentHighestBid);

    // For auto bidding
    const isAutoSubmitDisabled = isAutomaticBidding && (!automaticBidIncrement || Number(automaticBidIncrement) <= 0);

    const isSubmitDisabled = isManualSubmitDisabled || isAutoSubmitDisabled;

    const isBiddingActive = biddingStatus === BiddingStatus.ACTIVE;

    // Common props for both components
    const commonProps = {
        bids,
        biddingStatus,
        timeRemaining,
        currentHighestBid,
        minimumBidAmount,
        isBiddingActive,
        bidAmount,
        setBidAmount,
        isAutomaticBidding,
        setIsAutomaticBidding,
        automaticBidIncrement,
        setAutomaticBidIncrement,
        isAutoBidEnabled,
        setIsAutoBidEnabled,
        placingBid,
        settingBidMode,
        fetchingBidMode,
        error,
        isSubmitDisabled,
        handleEnableAutoBid,
        handleSubmitBid,
        handleBidModeChange,
        handleDisableAutoBid
    };

    return (
        <>
            {/* Desktop Component */}
            <DesktopBidPlacement {...commonProps} />

            {/* Mobile Component */}
            <MobileBidPlacement 
                {...commonProps} 
                isBottomSheetOpen={isBottomSheetOpen}
                onCloseBidSheet={onCloseBidSheet}
            />
        </>
    )
}

export default BidPlacement;