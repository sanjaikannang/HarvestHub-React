import { Loader2, Trash2 } from "lucide-react"
import Modal from "../../Common/ui/Modal"
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../State/store";
import { deleteUser, fetchAllUsers } from "../../Services/adminActions";
import toast from "react-hot-toast";

interface DeleteUserProps {
    isOpen: boolean;
    onClose: () => void;
    userToDelete: { id: string; name: string } | null;
    deletingUserId: string | null;
    setDeletingUserId: (id: string | null) => void;
}

const DeleteUser: React.FC<DeleteUserProps> = ({
    isOpen,
    onClose,
    userToDelete,
    deletingUserId,
    setDeletingUserId
}) => {

    const dispatch = useDispatch<AppDispatch>();

    const handleDeleteUser = async () => {
        if (!userToDelete) return;

        setDeletingUserId(userToDelete.id);
        try {
            await dispatch(deleteUser(userToDelete.id));
            // Refresh the users list after successful deletion
            dispatch(fetchAllUsers());
            toast.success('User deleted successfully');
        } catch (error) {
            toast.error('Failed to delete user');
        } finally {
            setDeletingUserId(null);
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
                            Are you sure you want to delete user <strong>{userToDelete?.name}</strong>?
                            This action cannot be undone and will permanently remove all user data.
                        </p>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={handleDeleteUser}
                                disabled={deletingUserId === userToDelete?.id}
                                className="inline-flex items-center px-4 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {deletingUserId === userToDelete?.id ? (
                                    <>
                                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                        Deleting...
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

export default DeleteUser