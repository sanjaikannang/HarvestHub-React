import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "../../Common/ui/Card";
import { AppDispatch, RootState } from "../../State/store";
import { clearError, setLimit, setPage, setProductStatus } from "../../State/Slices/adminSlice";
import { fetchProducts } from "../../Services/adminActions";


const MainComponent: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {
        products,
        pagination,
        loading,
        error,
        filters
    } = useSelector((state: RootState) => state.admin);

    // Fetch products on component mount and when filters change
    useEffect(() => {
        dispatch(fetchProducts(filters));
    }, [dispatch, filters]);

    // Handle page change
    const handlePageChange = (newPage: number) => {
        dispatch(setPage(newPage));
    };

    // Handle limit change
    const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(setLimit(Number(event.target.value)));
    };

    // Handle status filter change
    const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        dispatch(setProductStatus(value === '' ? undefined : value));
    };

    // Handle error dismissal
    const handleClearError = () => {
        dispatch(clearError());
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

    return (
        <>
            <main className="flex-1 p-6 bg-gray-50 overflow-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                Product Management
                            </h1>
                            <p className="text-gray-600">Manage all products in the system</p>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        <div className="flex justify-between items-center">
                            <span>{error}</span>
                            <button
                                onClick={handleClearError}
                                className="text-red-500 hover:text-red-700"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="mb-6 flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2">
                        <label htmlFor="status-filter" className="text-sm font-medium text-gray-700">
                            Status:
                        </label>
                        <select
                            id="status-filter"
                            value={filters.productStatus || ''}
                            onChange={handleStatusChange}
                            disabled={loading}
                            className="border border-gray-300 rounded-md px-3 py-1 text-sm disabled:opacity-50"
                        >
                            <option value="">All Statuses</option>
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                            <option value="SOLD">Sold</option>
                            <option value="EXPIRED">Expired</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <label htmlFor="limit-select" className="text-sm font-medium text-gray-700">
                            Per Page:
                        </label>
                        <select
                            id="limit-select"
                            value={filters.limit}
                            onChange={handleLimitChange}
                            disabled={loading}
                            className="border border-gray-300 rounded-md px-3 py-1 text-sm disabled:opacity-50"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>

                    {pagination && (
                        <div className="text-sm text-gray-600">
                            Showing {((pagination.currentPage - 1) * filters.limit) + 1} to{' '}
                            {Math.min(pagination.currentPage * filters.limit, pagination.totalProducts)} of{' '}
                            {pagination.totalProducts} products
                        </div>
                    )}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                )}

                {/* Product Cards */}
                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {products.length > 0 ? (
                            products.map((product) => (
                                <Card
                                    key={product._id}
                                    image={product.images?.[0] || ""}
                                    status={product.productStatus.toLowerCase()}
                                    data={{
                                        title: product.name,
                                        subtitle: `Quantity: ${product.quantity.value} ${product.quantity.unit}`,
                                        description: product.description,
                                        price: product.currentHighestBid,
                                        originalPrice: product.startingPrice,                                                                              
                                    }}
                                    primaryButton={{
                                        label: "View Product",
                                        onClick: () => console.log(`View product ${product._id}`)
                                    }}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <p className="text-gray-500">No products found.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && !loading && (
                    <div className="flex justify-center items-center space-x-2">
                        {/* Previous Button */}
                        <button
                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                            disabled={!pagination.hasPrevPage}
                            className={`px-3 py-2 rounded-md text-sm font-medium ${pagination.hasPrevPage
                                ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            Previous
                        </button>

                        {/* Page Numbers */}
                        {getPageNumbers().map((pageNumber) => (
                            <button
                                key={pageNumber}
                                onClick={() => handlePageChange(pageNumber)}
                                className={`px-3 py-2 rounded-md text-sm font-medium ${pageNumber === pagination.currentPage
                                    ? 'bg-blue-500 text-white'
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
                            className={`px-3 py-2 rounded-md text-sm font-medium ${pagination.hasNextPage
                                ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            Next
                        </button>
                    </div>
                )}
            </main>
        </>
    );
};

export default MainComponent;