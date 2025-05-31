import React from 'react';
import { Link } from 'react-router-dom';

const FarmerDashboard: React.FC = () => {
    // Mock data for demonstration
    const stats = [
        { name: 'Total Products', value: '12', icon: '🌾', color: 'bg-blue-500' },
        { name: 'Active Bids', value: '8', icon: '🔥', color: 'bg-green-500' },
        { name: 'Sold Products', value: '24', icon: '✅', color: 'bg-purple-500' },
        { name: 'Total Revenue', value: '₹45,230', icon: '💰', color: 'bg-yellow-500' },
    ];

    const recentProducts = [
        { id: 1, name: 'Organic Tomatoes', status: 'Active', bids: 5, currentPrice: '₹280/kg' },
        { id: 2, name: 'Fresh Pomegranates', status: 'Active', bids: 3, currentPrice: '₹250/kg' },
        { id: 3, name: 'Basmati Rice', status: 'Sold', bids: 12, currentPrice: '₹180/kg' },
        { id: 4, name: 'Organic Apples', status: 'Active', bids: 7, currentPrice: '₹320/kg' },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-800';
            case 'Sold': return 'bg-blue-100 text-blue-800';
            case 'Expired': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <>
        <div className="p-6 space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg">
                <div className="px-6 py-8 text-white">
                    <h1 className="text-3xl font-bold mb-2">Welcome back, Farmer! 👋</h1>
                    <p className="text-green-100 mb-4">
                        Manage your products, track bids, and grow your farming business.
                    </p>
                    <Link
                        to="/farmer/create-product"
                        className="bg-white text-green-600 px-6 py-2 rounded-md font-medium hover:bg-gray-50 transition-colors inline-flex items-center space-x-2"
                    >
                        <span>➕</span>
                        <span>Create New Product</span>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 truncate">
                                    {stat.name}
                                </p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {stat.value}
                                </p>
                            </div>
                            <div className={`${stat.color} p-3 rounded-full text-white text-xl`}>
                                {stat.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link
                    to="/farmer/create-product"
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-dashed border-gray-200 hover:border-green-300"
                >
                    <div className="text-center">
                        <div className="text-4xl mb-3">➕</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Create Product</h3>
                        <p className="text-sm text-gray-600">Add a new product for bidding</p>
                    </div>
                </Link>

                <Link
                    to="/farmer/products"
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                    <div className="text-center">
                        <div className="text-4xl mb-3">🌾</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">My Products</h3>
                        <p className="text-sm text-gray-600">View and manage your products</p>
                    </div>
                </Link>

                <Link
                    to="/farmer/analytics"
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                    <div className="text-center">
                        <div className="text-4xl mb-3">📈</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics</h3>
                        <p className="text-sm text-gray-600">Track your performance</p>
                    </div>
                </Link>
            </div>

            {/* Recent Products */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-medium text-gray-900">Recent Products</h2>
                        <Link
                            to="/farmer/products"
                            className="text-sm text-green-600 hover:text-green-700 font-medium"
                        >
                            View all →
                        </Link>
                    </div>
                </div>
                <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Product
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Bids
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Current Price
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {recentProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {product.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {product.bids} bids
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {product.currentPrice}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        </>
    );
};

export default FarmerDashboard;