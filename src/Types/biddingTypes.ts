export interface PlaceBidRequest {
    productId: string;
    bidAmount: number;
}

export interface BidData {
    _id: string;
    productId: string;
    bidderId: string;
    bidAmount: number;
    bidTime: Date;
    isWinningBid: boolean;
    bidStatus: 'ACTIVE' | 'CLOSED' | 'CANCELLED';
}

export interface RecentBid {
    bidderId: string;
    bidderName: string;
    bidAmount: number;
    bidTime: Date;
}

export interface AuctionState {
    productId: string;
    productName: string;
    description: string;
    startingPrice: number;
    currentHighestBid: number;
    currentHighestBidderId: string | null;
    currentHighestBidderName: string | null;
    bidStartDate: Date;
    bidEndDate: Date;
    bidStartTime: Date;
    bidEndTime: Date;
    isActive: boolean;
    totalBids: number;
    recentBids: RecentBid[];
}

export interface BiddingSocketEvents {
    // Outgoing events
    joinAuction: (productId: string) => void;
    leaveAuction: (productId: string) => void;
    placeBid: (bidData: PlaceBidRequest) => void;

    // Incoming events
    auctionState: (data: AuctionState) => void;
    auctionUpdate: (data: AuctionState) => void;
    bidPlaced: (data: { success: boolean; bid: BidData }) => void;
    bidError: (data: { message: string }) => void;
    error: (data: { message: string }) => void;
}

export interface BiddingState {
    // Current auction data
    currentAuction: AuctionState | null;

    // Socket connection status
    isConnected: boolean;

    // Loading states
    isPlacingBid: boolean;
    isJoiningAuction: boolean;

    // Error states
    error: string | null;
    bidError: string | null;

    // User's bids
    userBids: BidData[];

    // Current room
    joinedAuctionId: string | null;
}

export interface PlaceBidResponse {
    success: boolean;
    bid?: BidData;
    message?: string;
}