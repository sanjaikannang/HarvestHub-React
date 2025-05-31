import React, { useState } from 'react';

const Orders: React.FC = () => {
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Mock data for demonstration
    const orders = [
        {
            id: 'ORD-001',
            productName: 'Organic Tomatoes',
            buyerName: 'Rajesh Kumar',
            buyerEmail: 'rajesh@example.com',
            buyerPhone: '+91 98765 43210',
            quantity: 50,
            unit: 'kg',
            finalPrice: 320,
            totalAmount: 16000,
            status: 'Pending',
            orderDate: '2025-05-28',
            deliveryDate: '2025-06-02',
            paymentStatus: 'Pending',
            shippingAddress: '123 Main Street, Chennai, Tamil Nadu 600001'
        },
        {
            id: 'ORD-002',
            productName: 'Basmati Rice',
            buyerName: 'Priya Sharma',
            buyerEmail: 'priya@example.com',
            buyerPhone: '+91 87654 32109',
            quantity: 100,
            unit: 'kg',
            finalPrice: 180,
            totalAmount: 18000,
            status: 'Confirmed',
            orderDate: '2025-05-25',
            deliveryDate: '2025-05-30',
            paymentStatus: 'Paid',
            shippingAddress: '456 Oak Avenue, Mumbai, Maharashtra 400001'
        },
        {
            id: 'ORD-003',
            productName: 'Fresh Pomegranates',
            buyerName: 'Amit Patel',
            buyerEmail: 'amit@example.com',
            buyerPhone: '+91 76543 21098',
            quantity: 25,
            unit: 'kg',
            finalPrice: 280,
            totalAmount: 7000,
            status: 'Delivered',
            orderDate: '2025-05-20',
            deliveryDate: '2025-05-25',
            paymentStatus: 'Paid',
            shippingAddress: '789 Pine Road, Bangalore, Karnataka 560001'
        },
        {
            id: 'ORD-004',
            productName: 'Organic Apples',
            buyerName: 'Sunita Gupta',
            buyerEmail: 'sunita@example.com',
            buyerPhone: '+91 65432 10987',
            quantity: 30,
            unit: 'kg',
            finalPrice: 320,
            totalAmount: 9600,
            status: 'Cancelled',
            orderDate: '2025-05-22',
            deliveryDate: '2025-05-27',
            paymentStatus: 'Refunded',
            shippingAddress: '321 Elm Street, Delhi, Delhi 110001'
        },
        {
            id: 'ORD-005',
            productName: 'Wheat Flour',
            buyerName: 'Vikram Singh',
            buyerEmail: 'vikram@example.com',
            buyerPhone: '+91 54321 09876',
            quantity: 75,
            unit: 'kg',
            finalPrice: 52,
            totalAmount: 3900,
            status: 'Shipped',
            orderDate: '2025-05-24',
            deliveryDate: '2025-05-29',
            paymentStatus: 'Paid',
            shippingAddress: '654 Maple Drive, Pune, Maharashtra 411001'
        }
    ];

    const statuses = ['all', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Confirmed': return 'bg-blue-100 text-blue-800';
            case 'Shipped': return 'bg-purple-100 text-purple-800';
            case 'Delivered': return 'bg-green-100 text-green-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case 'Paid': return 'bg-green-100 text-green-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Refunded': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            order.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            order.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const handleStatusUpdate = (orderId: string, newStatus: string) => {
        // Handle status update logic here
        alert(`Order ${orderId} status updated to ${newStatus}`);
    };

    const orderStats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'Pending').length,
        confirmed: orders.filter(o => o.status === 'Confirmed').length,
        delivered: orders.filter(o => o.status === 'Delivered').length,
        totalRevenue: orders.filter(o => o.status === 'Delivered').reduce((sum, o) => sum + o.totalAmount, 0)
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
                <p className="text-gray-600 mt-1">Manage and track your product orders</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="flex items-center">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600">Total Orders</p>
                            <p className="text-2xl font-semibold text-gray-900">{orderStats.total}</p>
                        </div>
                        <div className="bg-blue-500 p-2 rounded-full">
                            <span className="text-white text-lg">📦</span>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="flex items-center">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600">Pending</p>
                            <p className="text-2xl font-semibold text-gray-900">{orderStats.pending}</p>
                        </div>
                        <div className="bg-yellow-500 p-2 rounded-full">
                            <span className="text-white text-lg">⏳</span>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="flex items-center">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600">Confirmed</p>
                            <p className="text-2xl font-semibold text-gray-900">{orderStats.confirmed}</p>
                        </div>
                        <div className="bg-blue-500 p-2 rounded-full">
                            <span className="text-white text-lg">✅</span>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="flex items-center">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600">Delivered</p>
                            <p className="text-2xl font-semibold text-gray-900">{orderStats.delivered}</p>
                        </div>
                        <div className="bg-green-500 p-2 rounded-full">
                            <span className="text-white text-lg">🚚</span>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="flex items-center">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600">Revenue</p>
                            <p className="text-2xl font-semibold text-gray-900">₹{orderStats.totalRevenue.toLocaleString()}</p>
                        </div>
                        <div className="bg-green-500 p-2 rounded-full">
                            <span className="text-white text-lg">💰</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Search Orders
                        </label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                            placeholder="Search by order ID, product, or buyer name..."
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
                </div>
            </div>

            {/* Orders List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order Details
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Buyer Information
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Product & Quantity
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{order.id}</div>
                                            <div className="text-sm text-gray-500">Order: {order.orderDate}</div>
                                            <div className="text-sm text-gray-500">Delivery: {order.deliveryDate}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{order.buyerName}</div>
                                            <div className="text-sm text-gray-500">{order.buyerEmail}</div>
                                            <div className="text-sm text-gray-500">{order.buyerPhone}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{order.productName}</div>
                                            <div className="text-sm text-gray-500">{order.quantity} {order.unit}</div>
                                            <div className="text-sm text-gray-500">₹{order.finalPrice}/{order.unit}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">₹{order.totalAmount.toLocaleString()}</div>
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                                                {order.paymentStatus}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-y-1">
                                        <button
                                            onClick={() => alert(`Viewing details for ${order.id}`)}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition-colors"
                                        >
                                            View Details
                                        </button>
                                        {order.status === 'Pending' && (
                                            <button
                                                onClick={() => handleStatusUpdate(order.id, 'Confirmed')}
                                                className="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs transition-colors"
                                            >
                                                Confirm
                                            </button>
                                        )}
                                        {order.status === 'Confirmed' && (
                                            <button
                                                onClick={() => handleStatusUpdate(order.id, 'Shipped')}
                                                className="w-full bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs transition-colors"
                                            >
                                                Mark Shipped
                                            </button>
                                        )}
                                        {order.status === 'Shipped' && (
                                            <button
                                                onClick={() => handleStatusUpdate(order.id, 'Delivered')}
                                                className="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs transition-colors"
                                            >
                                                Mark Delivered
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {filteredOrders.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📦</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                    <p className="text-gray-600">
                        {searchTerm || filterStatus !== 'all'
                            ? 'Try adjusting your search or filters'
                            : 'Orders will appear here when buyers purchase your products'
                        }
                    </p>
                </div>
            )}

            {/* Order Details Modal would go here in a real application */}
        </div>
    );
};

export default Orders;