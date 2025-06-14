import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../State/store';
import { fetchAllUsers } from '../../Services/adminActions';
import { clearUsersError, clearUsersMessage } from '../../State/Slices/adminSlice';
import toast from 'react-hot-toast';

const AllUsers = () => {
    const dispatch = useDispatch<AppDispatch>();
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
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                            <p className="mt-1 text-sm text-gray-500">No users have been registered yet.</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {users.map((user) => (
                                <li key={user._id} className="px-3 py-4 hover:bg-gray-50">
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
                                            <div className="flex flex-col items-end">
                                                <div className="text-xs">Joined</div>
                                                <div className="font-medium">
                                                    {formatDate(user.createdAt)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </main>
        </>
    );
};

export default AllUsers;