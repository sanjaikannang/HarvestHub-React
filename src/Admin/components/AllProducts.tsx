import React, { ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../State/store";
import { setPage, clearReviewProductError, clearReviewProductMessage } from "../../State/Slices/adminSlice";
import { fetchProducts, reviewProduct } from "../../Services/adminActions";
import { Spinner } from "../../Common/ui/Spinner";
import Table, { TableColumn, TableRow } from "../../Common/ui/Table";
import { Package, Trash2, CheckCircle, XCircle, Clock, ThumbsUp, ShoppingCart, Ban, HelpCircle } from "lucide-react";
import toast from "react-hot-toast";
import DeleteProduct from "./DeleteProduct";
import ReviewProduct from "./ReviewProduct";

const AllProducts: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [reviewStatus, setReviewStatus] = useState<'APPROVED' | 'REJECTED'>('APPROVED');
    const [adminFeedback, setAdminFeedback] = useState('');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<{ id: string; name: string } | null>(null);
    const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

    const {
        products,
        pagination,
        loading,
        error,
        filters,
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

    // Handle review button click
    const handleReviewClick = (productId: string, event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent accordion toggle
        setSelectedProductId(productId);
        setIsReviewModalOpen(true);
    };

    // Add this function to your parent component
    const openDeleteModal = (id: string, name: string) => {
        setProductToDelete({ id, name });
        setDeleteModalOpen(true);
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

    // Handle modal close
    const handleModalClose = () => {
        setIsReviewModalOpen(false);
        setAdminFeedback('');
        setReviewStatus('APPROVED');
        setSelectedProductId(null);
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

    // Table configuration
    const columns: TableColumn[] = [
        {
            key: 'id',
            label: 'Product Id',
            width: '250px',
            align: 'left',
        },
        {
            key: 'name',
            label: 'Product Name',
            width: '250px',
            align: 'left',
        },
        {
            key: 'productStatus',
            label: 'Product Status',
            width: '200px',
            align: 'left',
        },
        {
            key: 'startingPrice',
            label: 'Price',
            width: '150px',
            align: 'left',
        },
        {
            key: 'actions',
            label: 'Actions',
            width: '150px',
            align: 'left'
        },
        {
            key: 'farmerId',
            label: 'Farmer Id',
            width: '250px',
            align: 'left',
        },
        {
            key: 'currentHighestBid',
            label: 'Highest Bid',
            width: '150px',
            align: 'left',
        },
        {
            key: 'bidStartTime',
            label: 'Bid Time',
            width: '150px',
            align: 'left',
        },
        {
            key: 'bidEndTime',
            label: 'Bid Time',
            width: '150px',
            align: 'left',
        },
        {
            key: 'bidStartDate',
            label: 'Bid Time',
            width: '150px',
            align: 'left',
        },
        {
            key: 'bidEndDate',
            label: 'Bid Time',
            width: '150px',
            align: 'left',
        },
    ];

    // Custom cell renderer
    const renderCell = (column: TableColumn, row: TableRow, value: any) => {
        switch (column.key) {
            case 'name':
                return (
                    <div className="font-medium text-gray-600">
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
                    <div className="flex space-x-1">
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

            case 'farmerId':
                return (
                    <div className="text-gray-600">
                        {value}
                    </div>
                );

            case 'currentHighestBid':
                return (
                    <div className="text-gray-600">
                        {value}
                    </div>
                )

            case 'bidStartTime':
                return (
                    <div className="text-gray-600">
                        {value}
                    </div>
                )

            case 'bidEndTime':
                return (
                    <div className="text-gray-600">
                        {value}
                    </div>
                )

            case 'bidStartDate':
                return (
                    <div className="text-gray-600">
                        {value}
                    </div>
                )

            case 'bidEndDate':
                return (
                    <div className="text-gray-600">
                        {value}
                    </div>
                )

            default:
                return value;
        }
    };

    // Custom empty state
    const emptyState = {
        icon: <Package className="mx-auto h-12 w-12 text-gray-400" />,
        title: 'No products found',
        description: 'No products have been added yet.'
    };

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
                            {pagination && (
                                <p className="text-sm font-semibold text-gray-600 mt-1">
                                    Total - {pagination.totalProducts} products
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Products Table */}
                <Table
                    columns={columns}
                    data={products.map((product) => ({ ...product, id: product._id }))}
                    loading={loading}
                    renderCell={renderCell}
                    emptyState={emptyState}
                    showPagination={true}
                    pagination={pagination ?? undefined}
                    onPageChange={handlePageChange}
                    itemsPerPage={filters.limit}
                    paginationLabel="products"
                    className=""
                />
            </main>

            {/* Review Product Modal */}
            <ReviewProduct
                isOpen={isReviewModalOpen}
                onClose={handleModalClose}
                selectedProductId={selectedProductId}
                reviewStatus={reviewStatus}
                setReviewStatus={setReviewStatus}
                adminFeedback={adminFeedback}
                setAdminFeedback={setAdminFeedback}
                onReviewSubmit={handleReviewSubmit}
            />

            {/* Delete Confirmation Modal */}
            <DeleteProduct
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                productToDelete={productToDelete}
                deletingProductId={deletingProductId}
                setDeletingProductId={setDeletingProductId}
            />
        </>
    );
};

export default AllProducts;