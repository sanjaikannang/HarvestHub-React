import { useState } from "react";
import { Send, X, Phone, User, Clock } from "lucide-react";

interface Message {
    id: number;
    senderId: number;
    text: string;
    timestamp: string;
    isAdmin: boolean;
}

const Chatting = () => {
    const [newMessage, setNewMessage] = useState("");
    const [showUserDetails, setShowUserDetails] = useState(false);

    // Admin user data
    const adminUser = {
        id: 0,
        name: "Admin Support",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        isOnline: true,
        email: "admin@company.com",
        phone: "+1 (555) 000-0000",
        status: "Online - Available for support",
    };

    // Mock messages between buyer and admin
    const messages: Message[] = [
        {
            id: 1,
            senderId: 1, // buyer
            text: "Hi there! I need help with my recent order",
            timestamp: "10:25 AM",
            isAdmin: false,
        },
        {
            id: 2,
            senderId: 0, // admin
            text: "Hello! I'd be happy to help you with your order. Can you provide me with your order number?",
            timestamp: "10:26 AM",
            isAdmin: true,
        },
        {
            id: 3,
            senderId: 1, // buyer
            text: "Sure, it's #12345",
            timestamp: "10:27 AM",
            isAdmin: false,
        },
        {
            id: 4,
            senderId: 0, // admin
            text: "Let me check that for you right away. I can see your order here and it's currently being processed.",
            timestamp: "10:28 AM",
            isAdmin: true,
        },
        {
            id: 5,
            senderId: 1, // buyer
            text: "Great! When can I expect it to be shipped?",
            timestamp: "10:30 AM",
            isAdmin: false,
        },
    ];

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            console.log("Sending message:", newMessage);
            setNewMessage("");
        }
    };

    const handleUserAvatarClick = () => {
        setShowUserDetails(!showUserDetails);
    };

    const handleCloseUserDetails = () => {
        setShowUserDetails(false);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Main Chat Area */}
            <div className={`flex-1 flex flex-col h-full relative ${showUserDetails ? "lg:mr-80 xl:mr-96" : ""} transition-all duration-300`}>
                {/* Chat Header */}
                <div className="p-4 bg-white border-b border-gray-300 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <img
                                src={adminUser.avatar}
                                alt={adminUser.name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            {adminUser.isOnline && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                            )}
                        </div>
                        <div className="cursor-pointer" onClick={handleUserAvatarClick}>
                            <div>
                                <h3 className="font-semibold text-gray-800">
                                    {adminUser.name}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {adminUser.isOnline ? "Online" : "Last seen recently"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 h-fit">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.isAdmin ? "justify-start" : "justify-end"}`}
                        >
                            <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.isAdmin
                                    ? "bg-white text-gray-800 border border-gray-200"
                                    : "bg-green-500 text-white"
                                }`}
                            >
                                <p className="text-sm">{message.text}</p>
                                <p
                                    className={`text-xs mt-1 ${message.isAdmin ? "text-gray-500" : "text-green-100"}`}
                                >
                                    {message.timestamp}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Message Input - Fixed at bottom */}
                <div className="absolute bottom-0 left-0 right-0 px-2 py-4 bg-white border-t border-gray-300">
                    <div className="flex items-center space-x-2 w-full ml-auto">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                            />
                        </div>
                        <button
                            onClick={handleSendMessage}
                            className="px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center justify-center"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Admin Details Sidebar */}
            {showUserDetails && (
                <>
                    {/* Overlay for mobile */}
                    <div
                        className="lg:hidden fixed inset-0 backdrop-blur-sm z-30"
                        onClick={handleCloseUserDetails}
                    />

                    {/* Sidebar */}
                    <div className="fixed lg:absolute top-0 right-0 h-full w-full sm:w-80 lg:w-80 xl:w-96 bg-white border-l border-gray-300 z-40 lg:z-30 transform translate-x-0 transition-transform duration-300">
                        {/* Header */}
                        <div className="p-5 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Support Contact
                            </h3>
                            <button
                                onClick={handleCloseUserDetails}
                                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        {/* Admin Info */}
                        <div className="p-6">
                            {/* Profile Picture */}
                            <div className="text-center mb-6">
                                <div className="relative inline-block">
                                    <img
                                        src={adminUser.avatar}
                                        alt={adminUser.name}
                                        className="w-32 h-32 rounded-full object-cover mx-auto shadow-lg"
                                    />
                                    {adminUser.isOnline && (
                                        <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-400 rounded-full border-4 border-white"></div>
                                    )}
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 mt-4">
                                    {adminUser.name}
                                </h2>
                                <p className="text-gray-600 mt-1">{adminUser.status}</p>
                            </div>

                            {/* Details */}
                            <div className="space-y-6">
                                {/* Phone */}
                                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <Phone className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500">Phone</p>
                                        <p className="text-gray-800 font-medium">
                                            {adminUser.phone}
                                        </p>
                                    </div>
                                </div>

                                {/* Support Hours */}
                                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500">Support Hours</p>
                                        <p className="text-gray-800 font-medium">
                                            24/7 Available
                                        </p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <User className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="text-gray-800 font-medium">
                                            {adminUser.email}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Chatting;