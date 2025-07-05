import Modal from "../../Common/ui/Modal"
import { Spinner } from "../../Common/ui/Spinner";
import { Trash2 } from "lucide-react";
import { deleteproduct, fetchProducts } from "../../Services/adminActions";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../State/store";
import { useSelector } from "react-redux";

interface DeleteProductProps {
    isOpen: boolean;
    onClose: () => void;
    productToDelete: { id: string; name: string } | null;
    deletingProductId: string | null;
    setDeletingProductId: (id: string | null) => void;
}

const DeleteProduct: React.FC<DeleteProductProps> = ({
    isOpen,
    onClose,
    productToDelete,
    deletingProductId,
    setDeletingProductId
}) => {

    const { filters } = useSelector((state: RootState) => state.admin);
    const dispatch = useDispatch<AppDispatch>();

    const handleDeleteProduct = async () => {
        if (!productToDelete) return;

        setDeletingProductId(productToDelete.id);
        try {
            await dispatch(deleteproduct(productToDelete.id));
            dispatch(fetchProducts(filters));
            toast.success('Product deleted successfully');
        } catch (error) {
            toast.error('Failed to delete product');
        } finally {
            setDeletingProductId(null);
            onClose();
        }
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
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
                                onClick={onClose}
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
        </>
    )
}

export default DeleteProduct;