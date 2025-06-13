import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../../State/store";
import { fetchSpecificProduct } from "../../Services/adminActions";
import { Calendar, Package, DollarSign, User, Clock } from "lucide-react";
import toast from "react-hot-toast";

const ProductDetails: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const dispatch = useDispatch<AppDispatch>();

    const {
        currentProduct,
        loading,
        error,
    } = useSelector((state: RootState) => state.admin);

    // Handle array response - extract first product if it's an array
    const product = Array.isArray(currentProduct) ? currentProduct[0] : currentProduct;

    console.log("Current Product:", currentProduct);
    console.log("Loading:", loading);
    console.log("Error:", error);

    // Handle error with toast notification
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    // Fetch specific product when component mounts
    useEffect(() => {
        if (productId) {
            console.log("Fetching product with ID:", productId);
            dispatch(fetchSpecificProduct(productId));
        }
    }, [dispatch, productId]);

    const formatDate = (dateString: string | Date) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (timeString: string | Date) => {
        return new Date(timeString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Helper function to get status color
    const getStatusColor = (status: string) => {
        switch (status?.toUpperCase()) {
            case 'APPROVED':
                return 'bg-green-100 text-green-800';
            case 'REJECTED':
                return 'bg-red-100 text-red-800';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Show loading state
    if (loading) {
        return (
            <main className="px-4 py-4 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="h-64 bg-gray-200 rounded"></div>
                                <div className="space-y-4">
                                    <div className="h-8 bg-gray-200 rounded"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    // Show error state
    if (error && !product) {
        return (
            <main className="px-4 py-4 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-12">
                        <p className="text-red-500">Error: {error}</p>
                        <button
                            onClick={() => productId && dispatch(fetchSpecificProduct(productId))}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    // Show not found state only if loading is false and no product exists
    if (!loading && !product) {
        return (
            <main className="px-4 py-4 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-12">
                        <p className="text-gray-500">Product not found.</p>
                        <button
                            onClick={() => productId && dispatch(fetchSpecificProduct(productId))}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    // Render product details
    return (
        <main className="px-4 py-4 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Product Details Card */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Product Images */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                        <div className="space-y-4">
                            {product?.images && product.images.length > 0 ? (
                                <div className="space-y-4">
                                    <img
                                        src={product.images[0]}
                                        alt={product.name || 'Product Image'}
                                        className="w-full h-64 object-cover rounded-lg"
                                        onError={(e) => {
                                            console.error('Image failed to load:', product.images[0]);
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                    {product.images.length > 1 && (
                                        <div className="grid grid-cols-3 gap-2">
                                            {/* {product.images.slice(1, 4).map((image: string | undefined, index: number) => (
                                                <img
                                                    key={index}
                                                    src={image}
                                                    alt={`${product.name || 'Product'} ${index + 2}`}
                                                    className="w-full h-20 object-cover rounded"
                                                    onError={(e) => {
                                                        console.error('Image failed to load:', image);
                                                        e.currentTarget.style.display = 'none';
                                                    }}
                                                />
                                            ))} */}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <Package size={48} className="text-gray-400" />
                                </div>
                            )}
                        </div>

                        {/* Product Information */}
                        <div className="space-y-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                    {product?.name || 'Product Name Not Available'}
                                </h1>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(product?.productStatus || '')}`}>
                                    Status: {product?.productStatus || 'Unknown'}
                                </span>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                    <DollarSign size={20} className="text-green-600" />
                                    <div>
                                        <p className="text-xl font-semibold text-green-600">
                                            Starting Price: ${product?.startingPrice || 0}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <DollarSign size={20} className="text-blue-600" />
                                    <div>
                                        <p className="text-xl font-semibold text-blue-600">
                                            Current Highest Bid: ${product?.currentHighestBid || 0}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Package size={20} className="text-gray-600" />
                                    <div>
                                        <p className="text-sm text-gray-600">Quantity</p>
                                        <p className="font-medium">
                                            {product?.quantity?.value || 0} {product?.quantity?.unit || 'units'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <User size={20} className="text-gray-600" />
                                    <div>
                                        <p className="text-sm text-gray-600">Farmer ID</p>
                                        <p className="font-medium">{product?.farmerId || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="px-6 pb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                        <p className="text-gray-700 leading-relaxed">
                            {product?.description || 'No description available.'}
                        </p>
                    </div>

                    {/* Bid Information */}
                    <div className="px-6 pb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bidding Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2">
                                <Calendar size={20} className="text-gray-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Bid Start Date</p>
                                    <p className="font-medium">
                                        {product?.bidStartDate ? formatDate(product.bidStartDate) : 'Not set'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Calendar size={20} className="text-gray-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Bid End Date</p>
                                    <p className="font-medium">
                                        {product?.bidEndDate ? formatDate(product.bidEndDate) : 'Not set'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Clock size={20} className="text-gray-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Bid Start Time</p>
                                    <p className="font-medium">
                                        {product?.bidStartTime ? formatTime(product.bidStartTime) : 'Not set'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Clock size={20} className="text-gray-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Bid End Time</p>
                                    <p className="font-medium">
                                        {product?.bidEndTime ? formatTime(product.bidEndTime) : 'Not set'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>                   
                </div>
            </div>
        </main>
    );
};

export default ProductDetails;