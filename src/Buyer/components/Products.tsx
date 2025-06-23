import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../State/store";
import { setPage } from "../../State/Slices/adminSlice";
import { fetchProducts } from "../../Services/adminActions";
import { ArrowLeftFromLine, ArrowRight, ArrowRightFromLine, Bell, MoveHorizontal, Package } from "lucide-react";
import toast from "react-hot-toast";
import Approvred from '../../../public/stamp/verified_stamp.png'
import { useNavigate } from "react-router-dom";

const AllProducts: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate()

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

    // Handle view product navigation
    const handleViewProduct = (productId: string) => {
        navigate(`/buyer/bidding/${productId}`);
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
            <div key={`skeleton-${index}`} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                {/* Image Skeleton */}
                <div className="h-48 bg-gray-300"></div>

                {/* Content Skeleton */}
                <div className="p-4">
                    {/* Title Skeleton */}
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>

                    {/* Price Skeleton */}
                    <div className="h-3 bg-gray-300 rounded w-1/3 mb-1"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>

                    {/* Button Skeleton */}
                    <div className="h-10 bg-gray-300 rounded"></div>
                </div>
            </div>
        ));
    };

    return (
        <>          
            <main className="px-4 py-4 min-h-screen">
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
                    </div>
                </div>

                <div className="mb-6">
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {renderSkeletonProducts()}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
                            <p className="mt-1 text-sm text-gray-500">No products have been added yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <div
                                    key={product._id}
                                    className="bg-white rounded-lg shadow-md hover:shadow-lg duration-300 overflow-hidden relative">
                                    {/* Status Stamp */}
                                    <div className="absolute top-0.5 right-0.5 z-10 rounded-full">
                                        <img
                                            src={Approvred}
                                            alt="Approved"
                                            className="w-12 h-12 object-contain"
                                        />
                                    </div>

                                    {/* Product Image */}
                                    <div className="relative h-44 overflow-hidden">
                                        <img
                                            src={product.images[0]}
                                            className="w-full h-full object-cover duration-300 hover:scale-105"
                                        />
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-2">
                                        <div className="mb-3">
                                            <h3 className="text-xl font-medium">
                                                {product.name}
                                            </h3>
                                        </div>

                                        <div className="mb-3">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm text-gray-600">Starting Price</span>
                                                <span className="text-sm font-bold text-green-600">
                                                    ₹{product.startingPrice}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-300">
                                            <div className="flex justify-center items-center gap-2 mb-2 mt-2">
                                                <span className="text-sm font-semibold text-gray-700">
                                                    {new Date(product.bidStartDate).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2">
                                                <div className="text-center">
                                                    <div className="text-[10px] text-gray-500 font-medium mb-0.2">Start Time</div>
                                                </div>

                                                <div className="text-center">
                                                    <div className="text-[10px] text-gray-500 font-medium mb-0.2">End Time</div>
                                                </div>
                                            </div>

                                            {/* Time Slots with Move Horizontal Icon */}
                                            <div className="grid grid-cols-2 relative">
                                                <div className="text-center">
                                                    <div className="bg-white border-l border-t border-b border-gray-300 rounded-l-4xl py-1">
                                                        <span className="text-sm font-bold text-green-600">
                                                            {new Date(product.bidStartTime).toLocaleTimeString('en-US', {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                                hour12: true
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Move Horizontal Icon */}
                                                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                                                    <MoveHorizontal className="w-6 h-6 text-gray-400" />
                                                </div>

                                                <div className="text-center">
                                                    <div className="bg-white border-r border-t border-b border-gray-300 rounded-r-4xl py-1">
                                                        <span className="text-sm font-bold text-red-600">
                                                            {new Date(product.bidEndTime).toLocaleTimeString('en-US', {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                                hour12: true
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Buttons Section */}
                                        <div className="mt-4 flex gap-1.5">
                                            {/* Notification Button */}
                                            <button className="bg-gray-200 hover:bg-gray-200 text-gray-600 hover:text-gray-800 py-2 px-2.5 rounded-md duration-300 flex-shrink-0 cursor-pointer">
                                                <Bell className="w-4 h-4" />
                                            </button>

                                            {/* View Product Button */}
                                            <button
                                                onClick={() => handleViewProduct(product._id)}
                                                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 rounded-md cursor-pointer duration-300">
                                                <div className="flex items-center justify-center gap-3">
                                                    View Product
                                                    <ArrowRight className="w-4 h-4" />
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
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
            </main >
        </>
    )
}

export default AllProducts