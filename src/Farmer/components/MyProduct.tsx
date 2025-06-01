import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MyProduct: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');

    // Mock data for demonstration
    const products = [
        {
            id: 1,
            name: 'Organic Tomatoes',
            category: 'Vegetables',
            quantity: 100,
            unit: 'kg',
            startingPrice: 280,
            currentPrice: 320,
            status: 'Active',
            bids: 5,
            bidEndDate: '2025-06-05',
            image: 'https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=150&h=150&fit=crop'
        },
        {
            id: 2,
            name: 'Fresh Pomegranates',
            category: 'Fruits',
            quantity: 50,
            unit: 'kg',
            startingPrice: 250,
            currentPrice: 280,
            status: 'Active',
            bids: 3,
            bidEndDate: '2025-06-03',
            image: 'https://images.unsplash.com/photo-1553487205-eea65c8e6e47?w=150&h=150&fit=crop'
        },
        {
            id: 3,
            name: 'Basmati Rice',
            category: 'Grains',
            quantity: 200,
            unit: 'kg',
            startingPrice: 150,
            currentPrice: 180,
            status: 'Sold',
            bids: 12,
            bidEndDate: '2025-05-28',
            image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=150&h=150&fit=crop'
        },
        {
            id: 4,
            name: 'Organic Apples',
            category: 'Fruits',
            quantity: 75,
            unit: 'kg',
            startingPrice: 300,
            currentPrice: 320,
            status: 'Active',
            bids: 7,
            bidEndDate: '2025-06-07',
            image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=150&h=150&fit=crop'
        },
        {
            id: 5,
            name: 'Green Chilies',
            category: 'Vegetables',
            quantity: 25,
            unit: 'kg',
            startingPrice: 120,
            currentPrice: 120,
            status: 'Expired',
            bids: 2,
            bidEndDate: '2025-05-30',
            image: 'https://images.unsplash.com/photo-1583554424045-5c765b8b77d2?w=150&h=150&fit=crop'
        },
        {
            id: 6,
            name: 'Wheat Flour',
            category: 'Grains',
            quantity: 150,
            unit: 'kg',
            startingPrice: 45,
            currentPrice: 52,
            status: 'Sold',
            bids: 8,
            bidEndDate: '2025-05-25',
            image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=150&h=150&fit=crop'
        }
    ];

    const categories = ['all', 'Fruits', 'Vegetables', 'Grains', 'Pulses', 'Dairy', 'Spices'];
    const statuses = ['all', 'Active', 'Sold', 'Expired'];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-800';
            case 'Sold': return 'bg-blue-100 text-blue-800';
            case 'Expired': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
        const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
        return matchesSearch && matchesStatus && matchesCategory;
    });

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
                    <p className="text-gray-600 mt-1">Manage and track all your listed products</p>
                </div>
                <Link
                    to="/farmer/create-product"
                    className="mt-4 sm:mt-0 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium flex items-center space-x-2 w-fit transition-colors"
                >
                    <span>➕</span>
                    <span>Add New Product</span>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="flex items-center">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600">Total Products</p>
                            <p className="text-2xl font-semibold text-gray-900">{products.length}</p>
                        </div>
                        <div className="bg-blue-500 p-2 rounded-full">
                            <span className="text-white text-lg">🌾</span>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="flex items-center">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600">Active</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {products.filter(p => p.status === 'Active').length}
                            </p>
                        </div>
                        <div className="bg-green-500 p-2 rounded-full">
                            <span className="text-white text-lg">🔥</span>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="flex items-center">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600">Sold</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {products.filter(p => p.status === 'Sold').length}
                            </p>
                        </div>
                        <div className="bg-blue-500 p-2 rounded-full">
                            <span className="text-white text-lg">✅</span>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="flex items-center">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600">Total Bids</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {products.reduce((sum, p) => sum + p.bids, 0)}
                            </p>
                        </div>
                        <div className="bg-purple-500 p-2 rounded-full">
                            <span className="text-white text-lg">📊</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Search Products
                        </label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                            placeholder="Search by product name..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Filter by Status
                        </label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                        >
                            {statuses.map(status => (
                                <option key={status} value={status}>
                                    {status === 'all' ? 'All Status' : status}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Filter by Category
                        </label>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>
                                    {category === 'all' ? 'All Categories' : category}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                    <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="relative">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-48 object-cover"
                            />
                            <div className="absolute top-2 right-2">
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}>
                                    {product.status}
                                </span>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                                <span className="text-xs text-gray-500">{product.category}</span>
                            </div>
                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <span>Quantity:</span>
                                    <span className="font-medium">{product.quantity} {product.unit}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Starting Price:</span>
                                    <span className="font-medium">₹{product.startingPrice}/{product.unit}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Current Price:</span>
                                    <span className="font-medium text-green-600">₹{product.currentPrice}/{product.unit}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Total Bids:</span>
                                    <span className="font-medium">{product.bids}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Bid End Date:</span>
                                    <span className="font-medium">{product.bidEndDate}</span>
                                </div>
                            </div>
                            <div className="mt-4 flex space-x-2">
                                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    View Details
                                </button>
                                <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    Edit
                                </button>                                
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📦</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-600 mb-4">
                        {searchTerm || filterStatus !== 'all' || filterCategory !== 'all'
                            ? 'Try adjusting your search or filters'
                            : 'Get started by creating your first product'
                        }
                    </p>
                    {!searchTerm && filterStatus === 'all' && filterCategory === 'all' && (
                        <Link
                            to="/farmer/create-product"
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium inline-flex items-center space-x-2 transition-colors"
                        >
                            <span>➕</span>
                            <span>Create Product</span>
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
};

export default MyProduct;