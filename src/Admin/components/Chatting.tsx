import { useState } from "react";
import { Send, ArrowLeft, X, Phone, User, Clock } from "lucide-react";

interface User {
    id: number;
    name: string;
    avatar: string;
    lastMessage: string;
    timestamp: string;
    unreadCount: number;
    isOnline: boolean;
    email: string;
    phone: string;
    joinedDate: string;
    status: string;
}

interface Message {
    id: number;
    senderId: number;
    text: string;
    timestamp: string;
    isAdmin: boolean;
}

const Chatting = () => {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [newMessage, setNewMessage] = useState("");
    const [showUsersList, setShowUsersList] = useState(true);
    const [showUserDetails, setShowUserDetails] = useState(false);

    // Mock data
    const users: User[] = [
        {
            id: 1,
            name: "John Doe",
            avatar:
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            lastMessage: "Hey, I need help with my order",
            timestamp: "10:30 AM",
            unreadCount: 2,
            isOnline: true,
            email: "john.doe@email.com",
            phone: "+1 (555) 123-4567",
            joinedDate: "January 2024",
            status: "Available",
        },
        {
            id: 2,
            name: "Sarah Wilson",
            avatar:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            lastMessage: "Thank you for the quick response!",
            timestamp: "9:45 AM",
            unreadCount: 0,
            isOnline: false,
            email: "sarah.wilson@email.com",
            phone: "+1 (555) 987-6543",
            joinedDate: "February 2024",
            status: "Last seen 2 hours ago",
        },
        {
            id: 3,
            name: "Mike Johnson",
            avatar:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            lastMessage: "Can you check my payment status?",
            timestamp: "Yesterday",
            unreadCount: 1,
            isOnline: true,
            email: "mike.johnson@email.com",
            phone: "+1 (555) 456-7890",
            joinedDate: "March 2024",
            status: "Available",
        },
        {
            id: 4,
            name: "Emma Davis",
            avatar:
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
            lastMessage: "Perfect! Everything is working now.",
            timestamp: "Yesterday",
            unreadCount: 0,
            isOnline: false,
            email: "emma.davis@email.com",
            phone: "+1 (555) 321-0987",
            joinedDate: "December 2023",
            status: "Last seen yesterday",
        },
        {
            id: 5,
            name: "David Chen",
            avatar:
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
            lastMessage: "I have a question about billing",
            timestamp: "2 days ago",
            unreadCount: 3,
            isOnline: true,
            email: "david.chen@email.com",
            phone: "+1 (555) 654-3210",
            joinedDate: "November 2023",
            status: "Available",
        },
    ];

    const messages: { [key: number]: Message[] } = {
        1: [
            {
                id: 1,
                senderId: 1,
                text: "Hi there! I need help with my recent order",
                timestamp: "10:25 AM",
                isAdmin: false,
            },
            {
                id: 2,
                senderId: 0,
                text: "Hello John! I'd be happy to help you with your order. Can you provide me with your order number?",
                timestamp: "10:26 AM",
                isAdmin: true,
            },
            {
                id: 3,
                senderId: 1,
                text: "Sure, it's #12345",
                timestamp: "10:27 AM",
                isAdmin: false,
            },
            {
                id: 4,
                senderId: 0,
                text: "Let me check that for you right away.",
                timestamp: "10:28 AM",
                isAdmin: true,
            },
            {
                id: 5,
                senderId: 1,
                text: "Hey, I need help with my order",
                timestamp: "10:30 AM",
                isAdmin: false,
            },
        ],
        2: [
            {
                id: 1,
                senderId: 2,
                text: "Hi, I received my package today",
                timestamp: "9:40 AM",
                isAdmin: false,
            },
            {
                id: 2,
                senderId: 0,
                text: "That's great to hear! How is everything?",
                timestamp: "9:42 AM",
                isAdmin: true,
            },
            {
                id: 3,
                senderId: 2,
                text: "Thank you for the quick response!",
                timestamp: "9:45 AM",
                isAdmin: false,
            },
        ],
        3: [
            {
                id: 1,
                senderId: 3,
                text: "Can you check my payment status?",
                timestamp: "Yesterday",
                isAdmin: false,
            },
        ],
        4: [
            {
                id: 1,
                senderId: 4,
                text: "I was having issues with login",
                timestamp: "Yesterday",
                isAdmin: false,
            },
            {
                id: 2,
                senderId: 0,
                text: "Let me help you with that",
                timestamp: "Yesterday",
                isAdmin: true,
            },
            {
                id: 3,
                senderId: 4,
                text: "Perfect! Everything is working now.",
                timestamp: "Yesterday",
                isAdmin: false,
            },
        ],
        5: [
            {
                id: 1,
                senderId: 5,
                text: "I have a question about billing",
                timestamp: "2 days ago",
                isAdmin: false,
            },
        ],
    };

    const handleSendMessage = () => {
        if (newMessage.trim() && selectedUser) {
            console.log("Sending message:", newMessage);
            setNewMessage("");
        }
    };

    const handleUserSelect = (user: User) => {
        setSelectedUser(user);
        setShowUsersList(false); // Hide users list on mobile when a user is selected
        setShowUserDetails(false);
    };

    const handleBackToUsers = () => {
        setShowUsersList(true);
        setSelectedUser(null);
        setShowUserDetails(false);
    };

    const handleUserAvatarClick = () => {
        setShowUserDetails(!showUserDetails);
    };

    const handleCloseUserDetails = () => {
        setShowUserDetails(false);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Users Sidebar - Always visible on desktop, conditionally on mobile */}
            <div
                className={`${showUsersList ? "block" : "hidden"
                    } lg:block lg:w-80 bg-white border-r border-gray-300 flex flex-col w-full`}
            >
                {/* Users List */}
                <div className="flex-1 overflow-y-auto">
                    {users.map((user) => (
                        <div
                            key={user.id}
                            className={`p-3.5 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${selectedUser?.id === user.id ? "bg-green-100" : ""
                                }`}
                            onClick={() => handleUserSelect(user)}
                        >
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    {user.isOnline && (
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold text-gray-800 truncate">
                                            {user.name}
                                        </h3>
                                        <span className="text-xs text-gray-500">
                                            {user.timestamp}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-600 truncate">
                                            {user.lastMessage}
                                        </p>
                                        {user.unreadCount > 0 && (
                                            <span className="bg-green-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                                                {user.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area - Hidden on mobile when showing users list */}
            <div
                className={`${!showUsersList ? "block" : "hidden"
                    } lg:block flex-1 flex flex-col h-full relative ${showUserDetails ? "lg:mr-80 xl:mr-96" : ""
                    } transition-all duration-300`}
            >
                {selectedUser ? (
                    <>
                        {/* Chat Header with Back Button */}
                        <div className="p-4 bg-white border-b border-gray-300 flex items-center justify-between flex-shrink-0">
                            <div className="flex items-center space-x-3">
                                <button
                                    className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    onClick={handleBackToUsers}
                                >
                                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                                </button>
                                <div className="relative">
                                    <img
                                        src={selectedUser.avatar}
                                        alt={selectedUser.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    {selectedUser.isOnline && (
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                                    )}
                                </div>
                                <div className="cursor-pointer" onClick={handleUserAvatarClick}>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">
                                            {selectedUser.name}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {selectedUser.isOnline ? "Online" : "Last seen recently"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 h-fit">
                            {messages[selectedUser.id]?.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.isAdmin ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    <div
                                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.isAdmin
                                            ? "bg-green-500 text-white"
                                            : "bg-white text-gray-800 border border-gray-200"
                                            }`}
                                    >
                                        <p className="text-sm">{message.text}</p>
                                        <p
                                            className={`text-xs mt-1 ${message.isAdmin ? "text-green-100" : "text-gray-500"
                                                }`}
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
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
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
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-gray-50 h-full">
                        <div className="text-center">
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                Welcome to Admin Chat
                            </h3>
                            <p className="text-gray-500">
                                Select a user from the sidebar to start chatting
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* User Details Sidebar */}
            {showUserDetails && selectedUser && (
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
                                Contact Info
                            </h3>
                            <button
                                onClick={handleCloseUserDetails}
                                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        {/* User Info */}
                        <div className="p-6">
                            {/* Profile Picture */}
                            <div className="text-center mb-6">
                                <div className="relative inline-block">
                                    <img
                                        src={selectedUser.avatar}
                                        alt={selectedUser.name}
                                        className="w-32 h-32 rounded-full object-cover mx-auto shadow-lg"
                                    />
                                    {selectedUser.isOnline && (
                                        <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-400 rounded-full border-4 border-white"></div>
                                    )}
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 mt-4">
                                    {selectedUser.name}
                                </h2>
                                <p className="text-gray-600 mt-1">{selectedUser.status}</p>
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
                                            {selectedUser.phone}
                                        </p>
                                    </div>
                                </div>

                                {/* Joined Date */}
                                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500">Joined</p>
                                        <p className="text-gray-800 font-medium">
                                            {selectedUser.joinedDate}
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