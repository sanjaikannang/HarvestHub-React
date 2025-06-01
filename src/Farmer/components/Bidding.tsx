import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Bid {
    id: number;
    bidderName: string;
    amount: number;
    timestamp: Date;
    isWinning: boolean;
}

interface Product {
    id: number;
    name: string;
    description: string;
    category: string;
    quantity: number;
    unit: string;
    basePrice: number;
    currentPrice: number;
    imageUrl: string;
    endTime: Date;
    location: string;
    farmer: {
        name: string;
        rating: number;
        totalSales: number;
    };
}

const Bidding: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();

    const [product, setProduct] = useState<Product | null>(null);
    const [bids, setBids] = useState<Bid[]>([]);
    const [newBidAmount, setNewBidAmount] = useState<string>('');
    const [timeRemaining, setTimeRemaining] = useState<string>('');
    const [isActive, setIsActive] = useState(true);
    const [userBid, setUserBid] = useState<number | null>(null);

    // Mock product data
    useEffect(() => {
        const mockProduct: Product = {
            id: parseInt(productId || '1'),
            name: 'Premium Organic Tomatoes',
            description: 'Fresh, organically grown tomatoes from our farm. Perfect for cooking and salads. Harvested this morning with no pesticides used.',
            category: 'Vegetables',
            quantity: 100,
            unit: 'kg',
            basePrice: 250,
            currentPrice: 320,
            imageUrl: '/api/placeholder/400/300',
            endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
            location: 'Pune, Maharashtra',
            farmer: {
                name: 'Raj Patel',
                rating: 4.8,
                totalSales: 150
            }
        };

        const mockBids: Bid[] = [
            { id: 1, bidderName: 'Buyer123', amount: 320, timestamp: new Date(Date.now() - 2 * 60 * 1000), isWinning: true },
            { id: 2, bidderName: 'FreshMart', amount: 315, timestamp: new Date(Date.now() - 5 * 60 * 1000), isWinning: false },
            { id: 3, bidderName: 'VeggieCorp', amount: 310, timestamp: new Date(Date.now() - 8 * 60 * 1000), isWinning: false },
            { id: 4, bidderName: 'LocalStore', amount: 305, timestamp: new Date(Date.now() - 12 * 60 * 1000), isWinning: false },
            { id: 5, bidderName: 'QuickBuy', amount: 300, timestamp: new Date(Date.now() - 15 * 60 * 1000), isWinning: false },
        ];

        setProduct(mockProduct);
        setBids(mockBids);
    }, [productId]);

    // Timer countdown
    useEffect(() => {
        if (!product) return;

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const endTime = product.endTime.getTime();
            const distance = endTime - now;

            if (distance > 0) {
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
            } else {
                setTimeRemaining('Bidding Ended');
                setIsActive(false);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [product]);

    // Simulate new bids coming in
    useEffect(() => {
        if (!isActive) return;

        const bidInterval = setInterval(() => {
            if (Math.random() > 0.7) { // 30% chance of new bid every 10 seconds
                const newBid: Bid = {
                    id: Date.now(),
                    bidderName: `Buyer${Math.floor(Math.random() * 1000)}`,
                    amount: (product?.currentPrice || 0) + Math.floor(Math.random() * 20) + 5,
                    timestamp: new Date(),
                    isWinning: true
                };

                setBids(prevBids => {
                    const updatedBids = prevBids.map(bid => ({ ...bid, isWinning: false }));
                    return [newBid, ...updatedBids];
                });

                setProduct(prev => prev ? { ...prev, currentPrice: newBid.amount } : null);
            }
        }, 10000);

        return () => clearInterval(bidInterval);
    }, [isActive, product?.currentPrice]);

    const handlePlaceBid = () => {
        const bidAmount = parseFloat(newBidAmount);
        if (!bidAmount || !product) return;

        if (bidAmount <= product.currentPrice) {
            alert('Bid amount must be higher than current price');
            return;
        }

        const newBid: Bid = {
            id: Date.now(),
            bidderName: 'You',
            amount: bidAmount,
            timestamp: new Date(),
            isWinning: true
        };

        setBids(prevBids => {
            const updatedBids = prevBids.map(bid => ({ ...bid, isWinning: false }));
            return [newBid, ...updatedBids];
        });

        setProduct(prev => prev ? { ...prev, currentPrice: bidAmount } : null);
        setUserBid(bidAmount);
        setNewBidAmount('');
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    if (!product) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <div className="text-4xl mb-4">🌾</div>
                    <p className="text-gray-600">Loading product details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Header */}
            <div className="mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
                >
                    <span className="mr-2">←</span>
                    Back to Products
                </button>
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Live Bidding</h1>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                        {isActive ? '🔴 Live' : '⏹️ Ended'}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Product Details */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                            <div className="flex items-center justify-center h-64 bg-gradient-to-br from-green-100 to-green-200">
                                <div className="text-center">
                                    <div className="text-6xl mb-2">🍅</div>
                                    <p className="text-gray-600">{product.name}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h2>
                                    <p className="text-gray-600 mb-4">{product.description}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-green-600">
                                        ₹{product.currentPrice}/{product.unit}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Base: ₹{product.basePrice}/{product.unit}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                    <div className="text-lg font-semibold text-gray-900">{product.quantity}</div>
                                    <div className="text-sm text-gray-600">Quantity ({product.unit})</div>
                                </div>
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                    <div className="text-lg font-semibold text-gray-900">{product.category}</div>
                                    <div className="text-sm text-gray-600">Category</div>
                                </div>
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                    <div className="text-lg font-semibold text-gray-900">{product.location}</div>
                                    <div className="text-sm text-gray-600">Location</div>
                                </div>
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                    <div className="text-lg font-semibold text-gray-900">{timeRemaining}</div>
                                    <div className="text-sm text-gray-600">Time Left</div>
                                </div>
                            </div>

                            {/* Farmer Info */}
                            <div className="border-t pt-4">
                                <h3 className="text-lg font-medium text-gray-900 mb-3">Farmer Information</h3>
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                        {product.farmer.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">{product.farmer.name}</div>
                                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                                            <span>⭐ {product.farmer.rating}/5</span>
                                            <span>📦 {product.farmer.totalSales} sales</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bidding Panel */}
                <div className="space-y-6">
                    {/* Current Status */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Current Status</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Current Highest Bid:</span>
                                <span className="font-bold text-green-600">₹{product.currentPrice}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Bids:</span>
                                <span className="font-medium">{bids.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Your Highest Bid:</span>
                                <span className="font-medium">
                                    {userBid ? `₹${userBid}` : 'Not placed'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Place Bid */}
                    {isActive && (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Place Your Bid</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Bid Amount (₹/{product.unit})
                                    </label>
                                    <input
                                        type="number"
                                        value={newBidAmount}
                                        onChange={(e) => setNewBidAmount(e.target.value)}
                                        placeholder={`Min: ₹${product.currentPrice + 1}`}
                                        min={product.currentPrice + 1}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>
                                <button
                                    onClick={handlePlaceBid}
                                    disabled={!newBidAmount || parseFloat(newBidAmount) <= product.currentPrice}
                                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-md font-medium transition-colors"
                                >
                                    Place Bid
                                </button>
                                <p className="text-xs text-gray-500 text-center">
                                    By placing a bid, you agree to our terms and conditions
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Bid History */}
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Bid History</h3>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            {bids.length > 0 ? (
                                <div className="divide-y divide-gray-200">
                                    {bids.map((bid) => (
                                        <div key={bid.id} className="px-6 py-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className={`w-3 h-3 rounded-full ${bid.isWinning ? 'bg-green-500' : 'bg-gray-300'
                                                        }`}></div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">
                                                            {bid.bidderName}
                                                            {bid.isWinning && (
                                                                <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                                                    Winning
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {formatTime(bid.timestamp)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold text-gray-900">₹{bid.amount}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="px-6 py-8 text-center text-gray-500">
                                    No bids placed yet
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Bidding;