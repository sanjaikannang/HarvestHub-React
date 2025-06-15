import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
    setJoiningAuction,
    setPlacingBid,
    clearCurrentAuction,
    clearErrors,
    setError,
    setBidError,
    setCurrentAuction
} from '../../State/Slices/biddingSlice';
import { RootState, store } from '../../State/store';
import socketService from '../../Services/Socket/socketService';
import biddingAPI from '../../Services/biddingAPI';

interface BiddingComponentProps {
    productId?: string;
}

const BiddingComponent: React.FC<BiddingComponentProps> = ({ productId: propProductId }) => {
    const { productId: paramProductId } = useParams<{ productId: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const productId = propProductId || paramProductId;
    const [bidAmount, setBidAmount] = useState<string>('');
    const [timeLeft, setTimeLeft] = useState<string>('');
    const [showBidHistory, setShowBidHistory] = useState(false);
    const [debugInfo, setDebugInfo] = useState<any[]>([]);

    const {
        currentAuction,
        isConnected,
        isPlacingBid,
        isJoiningAuction,
        error,
        bidError,
        joinedAuctionId
    } = useSelector((state: RootState) => state.bidding);

    // Debug function
    const addDebugInfo = (message: string, data?: any) => {
        const timestamp = new Date().toLocaleTimeString();
        setDebugInfo(prev => [...prev.slice(-9), { timestamp, message, data }]);
        console.log(`[${timestamp}] ${message}`, data);
    };

    // Initialize socket service with store
    useEffect(() => {
        addDebugInfo('Initializing socket service with store');
        socketService.initialize(store);
    }, []);

    // Initialize socket connection
    useEffect(() => {
        addDebugInfo('Socket connection effect', { isConnected, socketConnected: socketService.isConnected() });
        
        if (!isConnected && !socketService.isConnected()) {
            addDebugInfo('Attempting to connect to socket...');
            socketService.connect()
                .then(() => {
                    addDebugInfo('Socket connected successfully');
                })
                .catch((error) => {
                    addDebugInfo('Failed to connect to socket', error);
                    dispatch(setError('Failed to connect to bidding server'));
                });
        }

        return () => {
            if (joinedAuctionId) {
                addDebugInfo('Leaving auction on cleanup', joinedAuctionId);
                socketService.leaveAuction(joinedAuctionId);
            }
        };
    }, [isConnected, dispatch, joinedAuctionId]);

    // Join auction when component mounts or productId changes
    useEffect(() => {
        addDebugInfo('Join auction effect', { 
            productId, 
            isConnected, 
            joinedAuctionId,
            socketConnected: socketService.isConnected() 
        });
        
        if (productId && isConnected && socketService.isConnected() && joinedAuctionId !== productId) {
            handleJoinAuction();
        }
    }, [productId, isConnected, joinedAuctionId]);

    // Fallback: Try to get auction state via API if socket fails
    useEffect(() => {
        if (productId && isConnected && !currentAuction && !isJoiningAuction) {
            addDebugInfo('Trying to get auction state via API as fallback');
            
            const timer = setTimeout(async () => {
                try {
                    const auctionState = await biddingAPI.getAuctionState(productId);
                    addDebugInfo('Got auction state via API', auctionState);
                    dispatch(setCurrentAuction(auctionState));
                } catch (error) {
                    addDebugInfo('Failed to get auction state via API', error);
                }
            }, 3000); // Wait 3 seconds for socket

            return () => clearTimeout(timer);
        }
    }, [productId, isConnected, currentAuction, isJoiningAuction, dispatch]);

    // Calculate time left
    useEffect(() => {
        if (!currentAuction) return;

        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const endTime = new Date(currentAuction.bidEndDate).getTime();
            const difference = endTime - now;

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                if (days > 0) {
                    setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
                } else if (hours > 0) {
                    setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
                } else if (minutes > 0) {
                    setTimeLeft(`${minutes}m ${seconds}s`);
                } else {
                    setTimeLeft(`${seconds}s`);
                }
            } else {
                setTimeLeft('Auction Ended');
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [currentAuction]);

    const handleJoinAuction = useCallback(async () => {
        if (!productId) {
            addDebugInfo('No productId available for joining auction');
            return;
        }

        addDebugInfo('Joining auction for product', productId);
        dispatch(setJoiningAuction(true));
        dispatch(clearErrors());

        try {
            // Check if socket is actually connected
            if (!socketService.isConnected()) {
                addDebugInfo('Socket not connected, attempting to connect first');
                await socketService.connect();
            }

            addDebugInfo('Emitting joinAuction event');
            socketService.joinAuction(productId);
            
            // Set a timeout to handle if socket doesn't respond
            setTimeout(() => {
                if (!currentAuction && isJoiningAuction) {
                    addDebugInfo('Socket join timeout, trying API fallback');
                    dispatch(setJoiningAuction(false));
                }
            }, 5000);
            
        } catch (error) {
            addDebugInfo('Error joining auction', error);
            dispatch(setError('Failed to join auction'));
            dispatch(setJoiningAuction(false));
        }
    }, [productId, dispatch, currentAuction, isJoiningAuction]);

    const handlePlaceBid = useCallback(async () => {
        if (!productId || !bidAmount) return;

        const bidAmountNum = parseFloat(bidAmount);
        if (isNaN(bidAmountNum) || bidAmountNum <= 0) {
            dispatch(setBidError('Please enter a valid bid amount'));
            return;
        }

        dispatch(setPlacingBid(true));
        dispatch(clearErrors());

        try {
            // Validate bid before placing
            const validation = await biddingAPI.validateBid(productId, bidAmountNum);
            if (!validation.valid) {
                dispatch(setBidError(validation.message || 'Invalid bid amount'));
                return;
            }

            socketService.placeBid({
                productId,
                bidAmount: bidAmountNum
            });

            setBidAmount('');
        } catch (error) {
            dispatch(setBidError('Failed to place bid'));
        } finally {
            dispatch(setPlacingBid(false));
        }
    }, [productId, bidAmount, dispatch]);

    const handleLeaveAuction = useCallback(() => {
        if (joinedAuctionId) {
            socketService.leaveAuction(joinedAuctionId);
            dispatch(clearCurrentAuction());
            navigate('/');
        }
    }, [joinedAuctionId, dispatch, navigate]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    // Manual retry function
    const handleRetry = () => {
        addDebugInfo('Manual retry triggered');
        dispatch(clearErrors());
        handleJoinAuction();
    };

    if (!productId) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-gray-500">No product selected for bidding</p>
            </div>
        );
    }

    if (!isConnected) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-500">Connecting to bidding server...</p>
                    <p className="text-xs text-gray-400 mt-2">
                        Socket Status: {socketService.isConnected() ? 'Connected' : 'Disconnected'}
                    </p>
                    <p className="text-xs text-gray-400">Redux Connected: {isConnected ? 'Yes' : 'No'}</p>
                </div>
            </div>
        );
    }

    if (isJoiningAuction) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-500">Joining auction...</p>
                    <p className="text-xs text-gray-400 mt-2">Product ID: {productId}</p>
                </div>
            </div>
        );
    }

    if (!currentAuction) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center max-w-2xl">
                    <p className="text-gray-500 mb-4">Failed to load auction data</p>
                    <button
                        onClick={handleRetry}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
                    >
                        Retry
                    </button>
                    
                    {/* Debug Information */}
                    <div className="bg-gray-100 p-4 rounded-lg text-left">
                        <h4 className="font-bold mb-2">Debug Info:</h4>
                        <div className="text-xs space-y-1 max-h-40 overflow-y-auto">
                            <p>Product ID: {productId}</p>
                            <p>Socket Connected: {socketService.isConnected() ? 'Yes' : 'No'}</p>
                            <p>Redux Connected: {isConnected ? 'Yes' : 'No'}</p>
                            <p>Current Auction: {currentAuction ? 'Present' : 'Null'}</p>
                            <p>Joined Auction ID: {joinedAuctionId || 'None'}</p>
                            <p>Error: {error || 'None'}</p>
                            <hr className="my-2" />
                            {debugInfo.map((info, index) => (
                                <div key={index} className="text-xs">
                                    <span className="font-mono">[{info.timestamp}]</span> {info.message}
                                    {info.data && <pre className="text-xs bg-gray-200 p-1 mt-1 rounded">{JSON.stringify(info.data, null, 2)}</pre>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        {currentAuction.productName}
                    </h1>
                    <p className="text-gray-600">{currentAuction.description}</p>
                </div>
                <button
                    onClick={handleLeaveAuction}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    Leave Auction
                </button>
            </div>

            {/* Auction Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">Current Highest Bid</h3>
                    <p className="text-2xl font-bold text-blue-600">
                        {formatCurrency(currentAuction.currentHighestBid)}
                    </p>
                    {currentAuction.currentHighestBidderName && (
                        <p className="text-sm text-gray-600 mt-1">
                            by {currentAuction.currentHighestBidderName}
                        </p>
                    )}
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-2">Starting Price</h3>
                    <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(currentAuction.startingPrice)}
                    </p>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-red-800 mb-2">Time Left</h3>
                    <p className="text-2xl font-bold text-red-600">{timeLeft}</p>
                </div>
            </div>

            {/* Bidding Form */}
            {currentAuction.isActive && (
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <h3 className="text-xl font-semibold mb-4">Place Your Bid</h3>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <input
                                type="number"
                                value={bidAmount}
                                onChange={(e) => setBidAmount(e.target.value)}
                                placeholder={`Enter amount higher than ${formatCurrency(currentAuction.currentHighestBid)}`}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                min={currentAuction.currentHighestBid + 0.01}
                                step="0.01"
                                disabled={isPlacingBid}
                            />
                        </div>
                        <button
                            onClick={handlePlaceBid}
                            disabled={isPlacingBid || !bidAmount}
                            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isPlacingBid ? 'Placing...' : 'Place Bid'}
                        </button>
                    </div>
                </div>
            )}

            {/* Error Messages */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {bidError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {bidError}
                </div>
            )}

            {/* Auction Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <h3 className="text-lg font-semibold mb-3">Auction Details</h3>
                    <div className="space-y-2">
                        <p><span className="font-medium">Total Bids:</span> {currentAuction.totalBids}</p>
                        <p><span className="font-medium">Start Date:</span> {formatDate(currentAuction.bidStartDate.toString())}</p>
                        <p><span className="font-medium">End Date:</span> {formatDate(currentAuction.bidEndDate.toString())}</p>
                        <p><span className="font-medium">Status:</span>
                            <span className={`ml-2 px-2 py-1 rounded text-sm ${currentAuction.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                {currentAuction.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </p>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold">Recent Bids</h3>
                        <button
                            onClick={() => setShowBidHistory(!showBidHistory)}
                            className="text-blue-500 hover:text-blue-700 text-sm"
                        >
                            {showBidHistory ? 'Hide' : 'Show All'}
                        </button>
                    </div>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                        {currentAuction.recentBids.slice(0, showBidHistory ? undefined : 5).map((bid, index) => (
                            <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                <div>
                                    <span className="font-medium">{bid.bidderName}</span>
                                    <p className="text-sm text-gray-500">
                                        {new Date(bid.bidTime).toLocaleTimeString()}
                                    </p>
                                </div>
                                <span className="font-bold text-green-600">
                                    {formatCurrency(bid.bidAmount)}
                                </span>
                            </div>
                        ))}
                        {currentAuction.recentBids.length === 0 && (
                            <p className="text-gray-500 text-center py-4">No bids yet</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Connection Status */}
            <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                    <span className="text-sm">
                        {isConnected ? 'Connected to auction' : 'Disconnected'}
                    </span>
                </div>
                <div className="text-sm text-gray-500">
                    Auction ID: {currentAuction.productId}
                </div>
            </div>
        </div>
    );
};

export default BiddingComponent;