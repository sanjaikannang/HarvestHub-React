import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../State/store";
import { setLimit, setPage, setProductStatus } from "../../State/Slices/adminSlice";
import { fetchProducts } from "../../Services/adminActions";
import Select from "../../Common/ui/Select";
import { ArrowLeftFromLine, ArrowRightFromLine, ChevronDown, Package, Trash2, Eye } from "lucide-react";
import toast from "react-hot-toast";

const AllProducts: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
    const {
        products,
        pagination,
        loading,
        error,
        filters,
    } = useSelector((state: RootState) => state.admin);

    // Handle error with toast notification
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error, dispatch]);

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

    // Handle product toggle
    const handleProductToggle = (productId: string) => {
        setExpandedProductId(expandedProductId === productId ? null : productId);
    };

    // Get status badge color
    const getStatusBadgeColor = (status: string) => {
        switch (status.toUpperCase()) {
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

    // Generate skeleton cards using Card component
    const renderSkeletonProducts = () => {
        return Array.from({ length: filters.limit }, (_, index) => (
            <div key={`skeleton-${index}`} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 items-center">
                <div className="col-span-12 md:col-span-6">
                    <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                </div>
                <div className="col-span-12 md:col-span-3 flex justify-center md:justify-center">
                    <div className="h-6 bg-gray-300 rounded-full w-20 animate-pulse"></div>
                </div>
                <div className="col-span-12 md:col-span-2 flex justify-center md:justify-center">
                    <div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div>
                </div>
                <div className="col-span-12 md:col-span-1 flex justify-center">
                    <div className="h-5 w-5 bg-gray-300 rounded animate-pulse"></div>
                </div>
            </div>
        ));
    };

    // Render product details in accordion
    const renderProductDetails = (product: any) => {
        return (
            <>
                <div className="col-span-12 px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {/* Product Images */}
                        {product.images && product.images.length > 0 && (
                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold text-gray-900">Product Images</h4>
                                <div className="grid grid-cols-3 gap-2">
                                    {product.images.map((image: string, index: number) => (
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
                                    <span className="ml-2 text-gray-600 font-mono text-xs">{product._id}</span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Farmer ID:</span>
                                    <span className="ml-2 text-gray-600 font-mono text-xs">{product.farmerId}</span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Starting Price:</span>
                                    <span className="ml-2 text-green-600 font-semibold">${product.startingPrice}</span>
                                </div>
                                {product.quantity && (
                                    <div>
                                        <span className="font-medium text-gray-700">Quantity:</span>
                                        <span className="ml-2 text-gray-600">{product.quantity.value} {product.quantity.unit}</span>
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
                                    <span className="ml-2 text-gray-600">{formatDate(product.bidStartDate)}</span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Bid End Date:</span>
                                    <span className="ml-2 text-gray-600">{formatDate(product.bidEndDate)}</span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Bid Start Time:</span>
                                    <span className="ml-2 text-gray-600">{formatDate(product.bidStartTime)}</span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Bid End Time:</span>
                                    <span className="ml-2 text-gray-600">{formatDate(product.bidEndTime)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Description */}
                    {product.description && (
                        <div className="mt-6">
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">Description</h4>
                            <p className="text-sm text-gray-600">
                                {product.description}
                            </p>
                        </div>
                    )}

                    <div className="border-t border-gray-300 mt-6"></div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex justify-end space-x-3">
                        <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors cursor-pointer">
                            <Eye className="w-4 h-4 mr-2" />
                            Review
                        </button>
                        <button className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors cursor-pointer">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                        </button>
                    </div>
                </div>
            </>
        );
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

                {/* Products Accordion */}
                <div className="bg-white shadow overflow-hidden sm:rounded-md mb-6">
                    {loading ? (
                        // Show skeleton products while loading
                        <ul className="divide-y divide-gray-200">
                            {renderSkeletonProducts()}
                        </ul>
                    ) : products.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
                            <p className="mt-1 text-sm text-gray-500">No products have been added yet.</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {products.map((product) => (
                                <li key={product._id} className="border-b border-gray-200 last:border-b-0">
                                    {/* Accordion Header */}
                                    <div
                                        className="px-4 py-5 hover:bg-gray-50 cursor-pointer transition-colors"
                                        onClick={() => handleProductToggle(product._id)}
                                    >
                                        <div className="flex items-center justify-between">
                                            {/* Product Name */}
                                            <div className="">
                                                <div className="text-sm font-medium text-gray-900 truncate">
                                                    {product.name}
                                                </div>
                                            </div>

                                            {/* Status Badge */}
                                            <div className="ml-4">
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(product.productStatus)}`}>
                                                    {product.productStatus}
                                                </span>
                                            </div>

                                            {/* Starting Price */}
                                            <div className="ml-4 text-sm font-medium text-gray-900">
                                                ₹ {product.startingPrice} /-
                                            </div>

                                            {/* Chevron Icon */}
                                            <div className="ml-4">
                                                <ChevronDown
                                                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${expandedProductId === product._id ? 'rotate-180' : ''
                                                        }`}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Accordion Content */}
                                    {expandedProductId === product._id && renderProductDetails(product)}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

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
            </main>
        </>
    )
}

export default AllProducts