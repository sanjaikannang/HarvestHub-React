import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../../State/store";
import { fetchSpecificProduct, reviewProduct } from "../../Services/adminActions";
import { Calendar, Package, DollarSign, User, Clock, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import { clearReviewProductError, clearReviewProductMessage } from "../../State/Slices/adminSlice";
import Modal from "../../Common/ui/Modal";
import { Spinner } from "../../Common/ui/Spinner";

const ProductDetails: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const dispatch = useDispatch<AppDispatch>();

    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [reviewStatus, setReviewStatus] = useState<'APPROVED' | 'REJECTED'>('APPROVED');
    const [adminFeedback, setAdminFeedback] = useState('');

    const {
        currentProduct,
        loading,
        error,
        reviewProductLoading,
        reviewProductError,
        reviewProductMessage,
    } = useSelector((state: RootState) => state.admin);

    // Handle array response - extract first product if it's an array
    const product = Array.isArray(currentProduct) ? currentProduct[0] : currentProduct;

    // Handle error with toast notification
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    // Handle review product success
    useEffect(() => {
        if (reviewProductMessage) {
            toast.success(reviewProductMessage);
            dispatch(clearReviewProductMessage());
            setIsReviewModalOpen(false);
            setAdminFeedback('');
            setReviewStatus('APPROVED');
            // Refetch the product to get updated status
            if (productId) {
                dispatch(fetchSpecificProduct(productId));
            }
        }
    }, [reviewProductMessage, dispatch, productId]);

    // Handle review product error
    useEffect(() => {
        if (reviewProductError) {
            toast.error(reviewProductError);
            dispatch(clearReviewProductError());
        }
    }, [reviewProductError, dispatch]);

    // Fetch specific product when component mounts
    useEffect(() => {
        if (productId) {
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

    // Handle review submission
    const handleReviewSubmit = async () => {
        if (!productId) return;

        // Validate feedback for rejection
        if (reviewStatus === 'REJECTED' && !adminFeedback.trim()) {
            toast.error('Admin feedback is required when rejecting a product');
            return;
        }

        try {
            await dispatch(reviewProduct(productId, {
                productId,
                status: reviewStatus,
                adminFeedback: reviewStatus === 'REJECTED' ? adminFeedback.trim() : undefined,
            }));
        } catch (error) {
            // Error is already handled in useEffect
        }
    };

    // Handle modal close
    const handleModalClose = () => {
        setIsReviewModalOpen(false);
        setAdminFeedback('');
        setReviewStatus('APPROVED');
    };

    // Handle status change
    const handleStatusChange = (status: 'APPROVED' | 'REJECTED') => {
        setReviewStatus(status);
        // Clear feedback when switching to approved
        if (status === 'APPROVED') {
            setAdminFeedback('');
        }
    };

    // Check if product can be reviewed (only PENDING products)
    const canReviewProduct = product?.productStatus?.toUpperCase() === 'PENDING';


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

    // Show not found state only if loading is false and no product exists
    if (!loading && !product) {
        return (
            <main className="px-4 py-4 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-12">
                        <p className="text-gray-500">Product not found.</p>
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
                            <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                                <Package size={48} className="text-gray-400" />
                            </div>
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

                            {/* Review Actions */}
                            {canReviewProduct && (
                                <div className="mt-6 pt-4 border-t">
                                    <button
                                        onClick={() => setIsReviewModalOpen(true)}
                                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Review Product
                                    </button>
                                </div>
                            )}
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

                {/* Review Modal using the existing Modal component */}
                <Modal
                    isOpen={isReviewModalOpen}
                    onClose={handleModalClose}
                    title="Review Product"
                    size="lg"
                >
                    {/* Action Buttons */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-4">
                            Choose Action
                        </label>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => handleStatusChange('APPROVED')}
                                className={`flex items-center justify-center px-4 py-1.5 rounded-md font-medium focus:outline-none transition-colors ${reviewStatus === 'APPROVED'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                    }`}
                            >
                                <CheckCircle size={20} className="mr-2" />
                                Approve Product
                            </button>
                            <button
                                onClick={() => handleStatusChange('REJECTED')}
                                className={`flex items-center justify-center px-4 py-1.5 rounded-md font-medium focus:outline-none transition-colors ${reviewStatus === 'REJECTED'
                                    ? 'bg-red-600 text-white'
                                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                                    }`}
                            >
                                <XCircle size={20} className="mr-2" />
                                Reject Product
                            </button>
                        </div>
                    </div>

                    {/* Admin Feedback (only shown when rejection is selected) */}
                    {reviewStatus === 'REJECTED' && (
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Reason for Rejection <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={adminFeedback}
                                onChange={(e) => setAdminFeedback(e.target.value)}
                                placeholder="Please provide a reason for rejection..."
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                This feedback will be sent to the farmer.
                            </p>
                        </div>
                    )}

                    {/* Submit Button (only shown when an action is selected) */}
                    {(reviewStatus === 'APPROVED' || reviewStatus === 'REJECTED') && (
                        <div className="flex justify-end pt-4 border-t border-gray-200">
                            <button
                                onClick={handleReviewSubmit}
                                disabled={reviewProductLoading || (reviewStatus === 'REJECTED' && !adminFeedback.trim())}
                                className={`px-6 py-1.5 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${reviewStatus === 'APPROVED'
                                    ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                                    : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                                    }`}
                            >
                                {reviewProductLoading ? (
                                    <span className="flex items-center">
                                        <div className="mr-2">
                                            <Spinner />
                                        </div>
                                        Processing...
                                    </span>
                                ) : (
                                    `Submit ${reviewStatus === 'APPROVED' ? 'Approval' : ''}`
                                )}
                            </button>
                        </div>
                    )}
                </Modal>
            </div>
        </main>
    );
};

export default ProductDetails;