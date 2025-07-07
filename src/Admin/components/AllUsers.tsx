import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Users,
    Trash2,
    Loader2,
    Shield,
    Sprout,
    ShoppingCart,
    HelpCircle,
} from 'lucide-react';
import { AppDispatch, RootState } from '../../State/store';
import { fetchAllUsers } from '../../Services/adminActions';
import { clearUsersError, clearUsersMessage } from '../../State/Slices/adminSlice';
import toast from 'react-hot-toast';
import Table, { TableColumn, TableRow } from '../../Common/ui/Table';
import { setPage } from "../../State/Slices/adminSlice";
import DeleteUser from './DeleteUser';
import { UserRole } from '../../utils/enum';
import { getUserAvatarColor } from '../../utils/userAvatarColor';
import { getRoleBadgeColor } from '../../utils/roleBadgeColor';

const AllUsers: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<{ id: string; name: string } | null>(null);

    const [filters] = useState({ limit: 10 });

    const {
        users,
        userPagination,
        usersLoading,
        usersError,
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
    
    // Function to get role icon based on user role
    const getRoleIcon = (role: string) => {
        switch (role.toLocaleLowerCase()) {
            case UserRole.ADMIN:
                return <Shield className="w-3 h-3 mr-2" />;
            case UserRole.FARMER:
                return <Sprout className="w-3 h-3 mr-2" />;
            case UserRole.BUYER:
                return <ShoppingCart className="w-3 h-3 mr-2" />;
            default:
                return <HelpCircle className="w-3 h-3 mr-2" />;
        }
    };

    const openDeleteModal = (userId: string, userName: string) => {
        setUserToDelete({ id: userId, name: userName });
        setDeleteModalOpen(true);
    };

    // Handle page change
    const handlePageChange = (newPage: number) => {
        dispatch(setPage(newPage));
    };

    // Table configuration
    const columns: TableColumn[] = [
        {
            key: 'name',
            label: 'Full Name',
            width: '200px',
            align: 'left',
        },
        {
            key: 'id',
            label: 'User ID',
            width: '250px',
            align: 'left',
        },
        {
            key: 'email',
            label: 'Email Address',
            width: '250px',
            align: 'left',
        },
        {
            key: 'role',
            label: 'Role',
            width: '120px',
            align: 'left',
        },
        {
            key: 'createdAt',
            label: 'Created At',
            width: '180px',
            align: 'left',
        },
        {
            key: 'updatedAt',
            label: 'Updated At',
            width: '180px',
            align: 'left',
        },
        {
            key: 'actions',
            label: 'Actions',
            width: '100px',
            align: 'left'
        },
    ];

    // Custom cell renderer
    const renderCell = (column: TableColumn, row: TableRow, value: any) => {
        switch (column.key) {
            case 'id':
                return (
                    <div className="text-gray-600 flex items-center cursor-pointer hover:underline">
                        <span className="break-all">{value}</span>
                    </div>
                );

            case 'name':
                return (
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className={`h-8 w-8 rounded-full ${getUserAvatarColor(value)} flex items-center justify-center`}>
                                <span className="text-xs font-medium text-white">
                                    {value.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        </div>
                        <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                                {value}
                            </div>
                        </div>
                    </div>
                );

            case 'email':
                return (
                    <div className="text-gray-600 text-sm">
                        {value}
                    </div>
                );

            case 'role':
                return (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${getRoleBadgeColor(value)}`}>
                        {getRoleIcon(value)}
                        {value}
                    </span>
                );

            case 'createdAt':
            case 'updatedAt':
                return (
                    <div className="text-gray-600 text-sm">
                        {formatDate(value)}
                    </div>
                );

            case 'actions':
                return (
                    <div className="flex space-x-1">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                openDeleteModal(row._id, row.name);
                            }}
                            disabled={deletingUserId === row._id}
                            className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {deletingUserId === row._id ? (
                                <>
                                    <Loader2 className="animate-spin w-4 h-4" />
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

    // Custom empty state
    const emptyState = {
        icon: <Users className="mx-auto h-12 w-12 text-gray-400" />,
        title: 'No users found',
        description: 'No users have been registered yet.'
    };

    return (
        <>
            <main className="px-4 py-4 bg-gray-50 overflow-hidden">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">
                                All Users
                            </h1>
                            {userPagination && (
                                <p className="text-sm font-semibold text-gray-600 mt-1">
                                    Total - {userPagination.totalProducts} users
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <Table
                    columns={columns}
                    data={users.map((user) => ({ ...user, id: user._id }))}
                    loading={usersLoading}
                    renderCell={renderCell}
                    emptyState={emptyState}
                    showPagination={true}
                    pagination={userPagination ?? undefined}
                    onPageChange={handlePageChange}
                    itemsPerPage={filters.limit}
                    paginationLabel="users"
                    className=""
                />
            </main>

            {/* Delete Confirmation Modal */}
            <DeleteUser
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                userToDelete={userToDelete}
                deletingUserId={deletingUserId}
                setDeletingUserId={setDeletingUserId}
            />
        </>
    );
};

export default AllUsers;