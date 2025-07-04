import React, { ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../State/store";
import { setLimit, setPage, setProductStatus, clearReviewProductError, clearReviewProductMessage } from "../../State/Slices/adminSlice";
import { deleteproduct, fetchProducts, reviewProduct } from "../../Services/adminActions";
import Select from "../../Common/ui/Select";
import Modal from "../../Common/ui/Modal";
import { Spinner } from "../../Common/ui/Spinner";
import Table, { TableColumn, TableRow } from "../../Common/ui/Table";
import { ArrowLeftFromLine, ArrowRightFromLine, Package, Trash2, CheckCircle, XCircle, Clock, ThumbsUp, ShoppingCart, Ban, HelpCircle } from "lucide-react";
import toast from "react-hot-toast";

const AllProducts: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [reviewStatus, setReviewStatus] = useState<'APPROVED' | 'REJECTED'>('APPROVED');
    const [adminFeedback, setAdminFeedback] = useState('');

    const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<{ id: string; name: string } | null>(null);

    const {
        products,
        pagination,
        loading,
        error,
        filters,
        reviewProductLoading,
        reviewProductError,
        reviewProductMessage,
        deleteProductError,
    } = useSelector((state: RootState) => state.admin);

    // Handle error with toast notification
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error, dispatch]);

    // Handle review product success
    useEffect(() => {
        if (reviewProductMessage) {
            toast.success(reviewProductMessage);
            dispatch(clearReviewProductMessage());
            setIsReviewModalOpen(false);
            setAdminFeedback('');
            setReviewStatus('APPROVED');
            setSelectedProductId(null);
            // Refetch products to get updated status
            dispatch(fetchProducts(filters));
        }
    }, [reviewProductMessage, dispatch, filters]);

    // Handle review product error
    useEffect(() => {
        if (reviewProductError) {
            toast.error(reviewProductError);
            dispatch(clearReviewProductError());
        }
    }, [reviewProductError, dispatch]);

    // Handle delete product error
    useEffect(() => {
        if (deleteProductError) {
            toast.error(deleteProductError);
            // You might want to add a clear delete error action
        }
    }, [deleteProductError, dispatch]);

    // Fetch products on component mount and when filters change
    useEffect(() => {
        dispatch(fetchProducts(filters));
    }, [dispatch, filters]);

    // Handle page change
    const handlePageChange = (newPage: number) => {
        dispatch(setPage(newPage));
    };

    // Handle limit change
    const handleLimitChange = (value: string | number) => {
        dispatch(setLimit(Number(value)));
    };

    // Handle status filter change
    const handleStatusChange = (value: string) => {
        dispatch(setProductStatus(value === '' ? undefined : value));
    };

    // Handle review button click
    const handleReviewClick = (productId: string, event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent accordion toggle
        setSelectedProductId(productId);
        setIsReviewModalOpen(true);
    };

    // Handle review submission
    const handleReviewSubmit = async () => {
        if (!selectedProductId) return;

        // Validate feedback for rejection
        if (reviewStatus === 'REJECTED' && !adminFeedback.trim()) {
            toast.error('Admin feedback is required when rejecting a product');
            return;
        }

        try {
            await dispatch(reviewProduct(selectedProductId, {
                productId: selectedProductId,
                status: reviewStatus,
                adminFeedback: reviewStatus === 'REJECTED' ? adminFeedback.trim() : undefined,
            }));
        } catch (error) {
            // Error is already handled in useEffect
        }
    };

    const openDeleteModal = (productId: string, productName: string) => {
        setProductToDelete({ id: productId, name: productName });
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
        setProductToDelete(null);
    };

    const handleDeleteProduct = async () => {
        if (!productToDelete) return;

        setDeletingProductId(productToDelete.id);
        try {
            await dispatch(deleteproduct(productToDelete.id));
            // Refresh the products list after successful deletion
            dispatch(fetchProducts(filters));
            toast.success('Product deleted successfully');
        } catch (error) {
            toast.error('Failed to delete product');
        } finally {
            setDeletingProductId(null);
            closeDeleteModal();
        }
    };

    // Handle modal close
    const handleModalClose = () => {
        setIsReviewModalOpen(false);
        setAdminFeedback('');
        setReviewStatus('APPROVED');
        setSelectedProductId(null);
    };

    // Handle status change in modal
    const handleReviewStatusChange = (status: 'APPROVED' | 'REJECTED') => {
        setReviewStatus(status);
        // Clear feedback when switching to approved
        if (status === 'APPROVED') {
            setAdminFeedback('');
        }
    };

    // Check if product can be reviewed (only PENDING products)
    const canReviewProduct = (productStatus: string) => {
        return productStatus?.toUpperCase() === 'PENDING';
    };

    // Get status badge color
    const getStatusBadgeColor = (status: string) => {
        switch (status?.toUpperCase()) {
            case 'ACTIVE':
                return 'bg-green-100 text-green-800';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'APPROVED':
                return 'bg-blue-100 text-blue-800';
            case 'REJECTED':
                return 'bg-red-100 text-red-800';
            case 'SOLD':
                return 'bg-purple-100 text-purple-800';
            case 'CANCELLED':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string): ReactNode => {
        switch (status?.toUpperCase()) {
            case 'ACTIVE':
                return <CheckCircle className="w-3 h-3 mr-2" />;
            case 'PENDING':
                return <Clock className="w-3 h-3 mr-2" />;
            case 'APPROVED':
                return <ThumbsUp className="w-3 h-3 mr-2" />;
            case 'REJECTED':
                return <XCircle className="w-3 h-3 mr-2" />;
            case 'SOLD':
                return <ShoppingCart className="w-3 h-2 mr-2" />;
            case 'CANCELLED':
                return <Ban className="w-3 h-3 mr-2" />;
            default:
                return <HelpCircle className="w-3 h-3 mr-2" />;
        }
    };


    // Format date function
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        if (!pagination) return [];

        const pages = [];
        const totalPages = pagination.totalPages;
        const currentPage = pagination.currentPage;

        // Show max 5 page numbers at a time
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);

        if (endPage - startPage < 4) {
            if (startPage === 1) {
                endPage = Math.min(totalPages, startPage + 4);
            } else if (endPage === totalPages) {
                startPage = Math.max(1, endPage - 4);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    // Table configuration
    const columns: TableColumn[] = [
        {
            key: 'id',
            label: 'Product Id',
            width: '25%',
            align: 'left',
            sortable: true
        },
        {
            key: 'name',
            label: 'Product Name',
            width: '25%',
            align: 'left',
            sortable: true
        },
        {
            key: 'productStatus',
            label: 'Product Status',
            width: '15%',
            align: 'left',
            sortable: true
        },        
        {
            key: 'startingPrice',
            label: 'Price',
            width: '15%',
            align: 'left',
            sortable: true
        },
        {
            key: 'actions',
            label: 'Actions',
            width: '20%',
            align: 'center'
        }
    ];

    // Custom cell renderer
    const renderCell = (column: TableColumn, row: TableRow, value: any) => {
        switch (column.key) {
            case 'name':
                return (
                    <div className="font-medium text-gray-900 truncate">
                        {value}
                    </div>
                );

            case 'productStatus':
                return (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${getStatusBadgeColor(value)}`}>
                        {getStatusIcon(value)}
                        {value}
                    </span>
                );

            case 'startingPrice':
                return (
                    <div className="font-medium text-gray-900">
                        ₹ {value} /-
                    </div>
                );

            case 'actions':
                return (
                    <div className="flex justify-center space-x-1">
                        {canReviewProduct(row.productStatus) && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleReviewClick(row._id, e);
                                }}
                                className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 cursor-pointer"
                            >
                                <CheckCircle className="w-4 h-4" />
                            </button>
                        )}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                openDeleteModal(row._id, row.name);
                            }}
                            disabled={deletingProductId === row._id}
                            className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-700 cursor-pointer"
                        >
                            {deletingProductId === row._id ? (
                                <>
                                    <Spinner />
                                    <span className="ml-1">Deleting...</span>
                                </>
                            ) : (
                                <>
                                    <Trash2 className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                );

            default:
                return value;
        }
    };

    // Render expanded content for each row
    const renderExpandedContent = (row: TableRow) => {
        return (
            <div className="px-4 py-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {/* Product Images */}
                    {row.images && row.images.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-gray-900">Product Images</h4>
                            <div className="grid grid-cols-3 gap-2">
                                {row.images.map((image: string, index: number) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`Product ${index + 1}`}
                                        className="h-20 w-20 object-cover rounded-md border border-gray-200 hover:opacity-80 transition-opacity"
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Product Basic Details */}
                    <div className="border border-gray-300 rounded-md p-4 space-y-3">
                        <h3 className="text-base font-bold text-gray-900 border-b border-gray-200 pb-2">Product Details</h3>
                        <div className="space-y-2 text-sm">
                            <div>
                                <span className="font-medium text-gray-700">Product ID:</span>
                                <span className="ml-2 text-gray-600 font-mono text-xs">{row._id}</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Farmer ID:</span>
                                <span className="ml-2 text-gray-600 font-mono text-xs">{row.farmerId}</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Starting Price:</span>
                                <span className="ml-2 text-green-600 font-semibold">₹{row.startingPrice}</span>
                            </div>
                            {row.quantity && (
                                <div>
                                    <span className="font-medium text-gray-700">Quantity:</span>
                                    <span className="ml-2 text-gray-600">{row.quantity.value} {row.quantity.unit}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bidding Information */}
                    <div className="border border-gray-300 rounded-md p-4 space-y-3">
                        <h3 className="text-base font-bold text-gray-900 border-b border-gray-200 pb-2">Bidding Information</h3>
                        <div className="space-y-2 text-sm">
                            <div>
                                <span className="font-medium text-gray-700">Bid Start Date:</span>
                                <span className="ml-2 text-gray-600">{formatDate(row.bidStartDate)}</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Bid End Date:</span>
                                <span className="ml-2 text-gray-600">{formatDate(row.bidEndDate)}</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Bid Start Time:</span>
                                <span className="ml-2 text-gray-600">{formatDate(row.bidStartTime)}</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Bid End Time:</span>
                                <span className="ml-2 text-gray-600">{formatDate(row.bidEndTime)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Description */}
                {row.description && (
                    <div className="mt-6">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Description</h4>
                        <p className="text-sm text-gray-600">{row.description}</p>
                    </div>
                )}
            </div>
        );
    };

    // Custom empty state
    const emptyState = {
        icon: <Package className="mx-auto h-12 w-12 text-gray-400" />,
        title: 'No products found',
        description: 'No products have been added yet.'
    };

    // Status options
    const statusOptions = [
        { value: '', label: 'All Statuses' },
        { value: 'ACTIVE', label: 'Active' },
        { value: 'PENDING', label: 'Pending' },
        { value: 'APPROVED', label: 'Approved' },
        { value: 'REJECTED', label: 'Rejected' },
        { value: 'SOLD', label: 'Sold' },
        { value: 'CANCELLED', label: 'Cancelled' }
    ];

    // Per page options
    const perPageOptions = [
        { value: '5', label: '5' },
        { value: '10', label: '10' },
        { value: '20', label: '20' },
        { value: '50', label: '50' }
    ];

    const renderDeleteModal = () => (
        <Modal
            isOpen={deleteModalOpen}
            onClose={closeDeleteModal}
            title="Confirm Delete"
            size="md"
        >
            <div className="flex items-start space-x-4">
                <div className="flex-1">
                    <p className="text-sm text-gray-900 mb-4">
                        Are you sure you want to delete product <strong>{productToDelete?.name}</strong>?
                        This action cannot be undone and will permanently remove the product.
                    </p>

                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={closeDeleteModal}
                            className="inline-flex items-center px-4 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none cursor-pointer"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleDeleteProduct}
                            disabled={deletingProductId === productToDelete?.id}
                            className="inline-flex items-center px-4 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {deletingProductId === productToDelete?.id ? (
                                <>
                                    <Spinner />
                                    <span className="ml-2">Deleting...</span>
                                </>
                            ) : (
                                <>
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );

    return (
        <>
            <main className="px-4 py-4 bg-gray-50 min-h-screen">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">
                                All Products
                            </h1>
                            {pagination && (
                                <p className="text-sm font-semibold text-gray-600 mt-1">
                                    Total - {pagination.totalProducts} products
                                </p>
                            )}
                        </div>

                        {/* Filters */}
                        <div className="flex gap-2 items-end">
                            <div className="flex items-center">
                                <Select
                                    id="status-filter"
                                    name="status"
                                    value={filters.productStatus || ''}
                                    onChange={handleStatusChange}
                                    options={statusOptions}
                                    disabled={loading}
                                    placeholder="All Statuses"
                                    size="sm"
                                    className="min-w-[140px]"
                                />
                            </div>

                            <div className="flex items-center">
                                <Select
                                    id="limit-select"
                                    name="limit-select"
                                    value={filters.limit.toString()}
                                    onChange={handleLimitChange}
                                    options={perPageOptions}
                                    disabled={loading}
                                    size="sm"
                                    className="min-w-[80px]"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Table */}
                <Table
                    columns={columns}
                    data={products.map((product) => ({ ...product, id: product._id }))}
                    loading={loading}
                    expandable={true}
                    renderCell={renderCell}
                    renderExpandedContent={renderExpandedContent}
                    emptyState={emptyState}
                    className="mb-6"
                />

                {/* Pagination - Only show when not loading and has pagination data */}
                {pagination && !loading && (
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
                        {/* Pagination Info */}
                        <div className="text-sm text-gray-600 text-center md:text-left">
                            Showing {((pagination.currentPage - 1) * filters.limit) + 1} to{' '}
                            {Math.min(pagination.currentPage * filters.limit, pagination.totalProducts)} of{' '}
                            {pagination.totalProducts} products
                        </div>

                        {/* Pagination Controls */}
                        {pagination.totalPages > 1 && (
                            <div className="flex justify-center items-center space-x-2">
                                {/* Previous Button */}
                                <button
                                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                                    disabled={!pagination.hasPrevPage}
                                    className={`px-4 py-1.5 rounded-md text-sm font-medium cursor-pointer ${pagination.hasPrevPage
                                        ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    <ArrowLeftFromLine
                                        className="text-gray-500"
                                        size={20} />
                                </button>

                                {/* Page Numbers */}
                                {getPageNumbers().map((pageNumber) => (
                                    <button
                                        key={pageNumber}
                                        onClick={() => handlePageChange(pageNumber)}
                                        className={`px-4 py-1.5 rounded-md text-sm font-medium cursor-pointer ${pageNumber === pagination.currentPage
                                            ? 'bg-green-500 text-white'
                                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        {pageNumber}
                                    </button>
                                ))}

                                {/* Next Button */}
                                <button
                                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                                    disabled={!pagination.hasNextPage}
                                    className={`px-4 py-1.5 rounded-md text-sm font-medium cursor-pointer ${pagination.hasNextPage
                                        ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    <ArrowRightFromLine
                                        className="text-gray-500"
                                        size={20} />
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Review Modal */}
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
                                onClick={() => handleReviewStatusChange('APPROVED')}
                                className={`flex items-center justify-center px-4 py-1.5 rounded-md font-medium focus:outline-none transition-colors ${reviewStatus === 'APPROVED'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                    }`}
                            >
                                <CheckCircle size={20} className="mr-2" />
                                Approve Product
                            </button>
                            <button
                                onClick={() => handleReviewStatusChange('REJECTED')}
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                This feedback will be sent to the farmer.
                            </p>
                        </div>
                    )}

                    {/* Submit Button */}
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
                                    `Submit ${reviewStatus === 'APPROVED' ? 'Approval' : 'Rejection'}`
                                )}
                            </button>
                        </div>
                    )}
                </Modal>
            </main>

            {/* Delete Confirmation Modal */}
            {renderDeleteModal()}
        </>
    );
};

export default AllProducts;