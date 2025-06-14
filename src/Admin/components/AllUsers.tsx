import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Users,
    ChevronDown,
    Loader2,
    Trash2,
} from 'lucide-react';
import { AppDispatch, RootState } from '../../State/store';
import { fetchAllUsers, fetchSpecificUser, deleteUser } from '../../Services/adminActions';
import { clearUsersError, clearUsersMessage } from '../../State/Slices/adminSlice';
import toast from 'react-hot-toast';
import Modal from '../../Common/ui/Modal';

const AllUsers = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
    const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<{ id: string; name: string } | null>(null);

    const {
        users,
        userPagination,
        usersLoading,
        usersError,
        specificUser,
        specificUserLoading,
    } = useSelector((state: RootState) => state.admin);

    // Handle error with toast notification
    useEffect(() => {
        if (usersError) {
            toast.error(usersError);
        }
    }, [usersError]);

    useEffect(() => {
        dispatch(fetchAllUsers());

        // Cleanup function to clear messages/errors when component unmounts
        return () => {
            dispatch(clearUsersError());
            dispatch(clearUsersMessage());
        };
    }, [dispatch]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role.toLowerCase()) {
            case 'admin':
                return 'bg-red-100 text-red-800';
            case 'farmer':
                return 'bg-green-100 text-green-800';
            case 'buyer':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleUserToggle = (userId: string) => {
        if (expandedUserId === userId) {
            setExpandedUserId(null);
        } else {
            setExpandedUserId(userId);
            dispatch(fetchSpecificUser(userId));
        }
    };

    const openDeleteModal = (userId: string, userName: string) => {
        setUserToDelete({ id: userId, name: userName });
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
        setUserToDelete(null);
    };

    const handleDeleteUser = async () => {
        if (!userToDelete) return;

        setDeletingUserId(userToDelete.id);
        try {
            await dispatch(deleteUser(userToDelete.id));
            // Refresh the users list after successful deletion
            dispatch(fetchAllUsers());
            setExpandedUserId(null); // Close accordion if the deleted user was expanded
            toast.success('User deleted successfully');
        } catch (error) {
            toast.error('Failed to delete user');
        } finally {
            setDeletingUserId(null);
            closeDeleteModal();
        }
    };

    // Generate skeleton cards with pulse animation
    const renderSkeletonUsers = () => {
        return Array.from({ length: 5 }, (_, index) => (
            <li key={`skeleton-${index}`} className="px-6 py-4 animate-pulse">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-gray-300"></div>
                        </div>
                        <div className="ml-4">
                            <div className="flex items-center">
                                <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
                                <div className="ml-2 h-5 bg-gray-300 rounded-full w-16"></div>
                            </div>
                            <div className="h-3 bg-gray-300 rounded w-48"></div>
                        </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                        <div className="flex flex-col items-end">
                            <div className="h-3 bg-gray-300 rounded w-12 mb-1"></div>
                            <div className="h-4 bg-gray-300 rounded w-20"></div>
                        </div>
                    </div>
                </div>
            </li>
        ));
    };

    const renderUserDetails = () => {
        if (specificUserLoading) {
            return (
                <div className="px-6 py-4 bg-gray-50 animate-pulse">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-300 rounded w-3/5"></div>
                    </div>
                </div>
            );
        }

        if (!specificUser) {
            return (
                <div className="px-6 py-4 bg-gray-50">
                    <p className="text-red-500 text-sm">Failed to load user details</p>
                </div>
            );
        }

        return (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="text-sm font-medium text-gray-600">User ID</label>
                        <p className="text-sm text-gray-900 break-all">{specificUser._id}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-600">Full Name</label>
                        <p className="text-sm text-gray-900">{specificUser.name}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-600">Email Address</label>
                        <p className="text-sm text-gray-900">{specificUser.email}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-600">Role</label>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(specificUser.role)}`}>
                            {specificUser.role}
                        </span>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-600">Account Created</label>
                        <p className="text-sm text-gray-900">{formatDate(specificUser.createdAt)}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-600">Last Updated</label>
                        <p className="text-sm text-gray-900">{formatDate(specificUser.updatedAt)}</p>
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-300">
                    <button
                        onClick={() => openDeleteModal(specificUser._id, specificUser.name)}
                        disabled={deletingUserId === specificUser._id}
                        className="inline-flex items-center px-4 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {deletingUserId === specificUser._id ? (
                            <>
                                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete User
                            </>
                        )}
                    </button>
                </div>
            </div>
        );
    };

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
    );

    return (
        <>
            <main className="px-4 py-4 bg-gray-50 min-h-screen">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            All Users
                        </h1>
                        {userPagination && (
                            <p className="text-sm font-semibold text-gray-600">
                                Total - {userPagination.totalUsers} users
                            </p>
                        )}
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white shadow overflow-hidden sm:rounded-md mb-6">
                    {usersLoading ? (
                        // Show skeleton users while loading
                        <ul className="divide-y divide-gray-200">
                            {renderSkeletonUsers()}
                        </ul>
                    ) : users.length === 0 ? (
                        <div className="text-center py-12">
                            <Users className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                            <p className="mt-1 text-sm text-gray-500">No users have been registered yet.</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {users.map((user) => (
                                <li key={user._id} className="border-b border-gray-200">
                                    <div
                                        className="px-3 py-4 hover:bg-gray-50 cursor-pointer"
                                        onClick={() => handleUserToggle(user._id)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                        <span className="text-sm font-medium text-gray-700">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="flex items-center">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {user.name}
                                                        </div>
                                                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                                                            {user.role}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <div className="transform transition-transform duration-200">
                                                    <ChevronDown
                                                        className={`w-5 h-5 transition-transform duration-200 ${expandedUserId === user._id ? 'rotate-180' : ''
                                                            }`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Accordion Content */}
                                    {expandedUserId === user._id && renderUserDetails()}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </main>

            {/* Delete Confirmation Modal */}
            {renderDeleteModal()}
        </>
    );
};

export default AllUsers;