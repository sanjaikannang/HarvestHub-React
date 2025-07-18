import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    BarChart3,
    Wheat,
    Plus,
    Package,
    TrendingUp,
    LogOut,
} from 'lucide-react';
import { useAppDispatch } from '../../State/hooks';
import { clearCredentials } from '../../State/Slices/authSlice';

interface SidebarProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (open: boolean) => void;
}

interface NavigationItem {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const navigation: NavigationItem[] = [
        { name: 'Dashboard', href: '/farmer', icon: BarChart3 },
        { name: 'Create Product', href: '/farmer/create-product', icon: Plus },
        { name: 'My Products', href: '/farmer/products', icon: Wheat },
        { name: 'Orders', href: '/farmer/orders', icon: Package },
        { name: 'Bidding', href: '/farmer/bidding', icon: TrendingUp },
    ];

    const isActive = (path: string) => {
        if (path === '/farmer' && location.pathname === '/farmer') return true;
        if (path !== '/farmer' && location.pathname.startsWith(path)) return true;
        return false;
    };

    const handleLogout = () => {
        dispatch(clearCredentials());
        navigate('/login');
    };

    return (
        <>
            {/* Sidebar */}
            <aside className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static inset-y-0 left-0 z-50 w-48 bg-whiteColor shadow-lg transform transition-transform duration-300 ease-in-out flex flex-col`}>

                {/* Logo */}
                <div className="h-16 flex items-center justify-center flex-shrink-0">
                    <h1 className="text-xl font-semibold text-gray-900">HarvestHub</h1>
                    <span className="ml-2 px-1 py-0.5 text-[10px] bg-lightgreenColor text-darkgreenColor rounded-full">
                        Farmer
                    </span>
                </div>

                {/* Navigation */}
                <div className="flex-1 flex flex-col pt-4">
                    <div className="flex-1">
                        <nav className="space-y-2 px-3">
                            {navigation.map((item) => {
                                const IconComponent = item.icon;
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={`${isActive(item.href)
                                            ? 'bg-green-50 border-greenColor text-darkgreenColor'
                                            : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            } group flex items-center px-3 py-3 text-sm font-medium border-l-4 transition-colors -mx-3`}
                                        onClick={() => setIsSidebarOpen(false)}
                                    >
                                        <IconComponent className="mr-3 h-5 w-5" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Logout Button at Bottom */}
                    <div className="flex-shrink-0 p-2 h-16 border-t border-gray-200">
                        <button
                            onClick={handleLogout}
                            className="group flex items-center w-full px-3 py-3 text-sm font-medium text-gray-600 hover:bg-lightredColor hover:text-darkredColor transition-colors rounded-md cursor-pointer"
                        >
                            <LogOut className="mr-3 h-5 w-5" />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 z-40 bg-gray-100 backdrop-blur-3xl"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </>
    );
};

export default Sidebar;