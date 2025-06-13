import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Card from "../../Common/ui/Card";
import { AppDispatch, RootState } from "../../State/store";
import { setLimit, setPage, setProductStatus } from "../../State/Slices/adminSlice";
import { fetchProducts } from "../../Services/adminActions";
import Select from "../../Common/ui/Select";
import { ArrowLeftFromLine, ArrowRightFromLine } from "lucide-react";
import toast from "react-hot-toast";

const AllProducts: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
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

    // Handle view product navigation
    const handleViewProduct = (productId: string) => {
        navigate(`/admin/product/${productId}`);
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
    const renderSkeletonCards = () => {
        return Array.from({ length: filters.limit }, (_, index) => (
            <Card key={`skeleton-${index}`} skeleton={true} />
        ));
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
            <main className="px-4 py-4 bg-gray-50">
                {/* Header */}
                <div className="mb-6">                    
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">
                                All Products
                            </h1>
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

                {/* Product Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
                    {loading ? (
                        // Show skeleton cards while loading
                        renderSkeletonCards()
                    ) : products.length > 0 ? (
                        // Show actual product cards when loaded
                        products.map((product) => (
                            <Card
                                key={product._id}
                                image={product.images?.[0] || ""}
                                status={product.productStatus.toLowerCase()}
                                data={{
                                    title: product.name,
                                    price: product.startingPrice,
                                }}
                                primaryButton={{
                                    label: "View Product",
                                    onClick: () => handleViewProduct(product._id)
                                }}
                            />
                        ))
                    ) : (
                        // Show empty state when no products
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-500">No products found.</p>
                        </div>
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