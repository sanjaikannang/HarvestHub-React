import React from 'react';
import { useAppSelector } from '../../State/hooks';
import { AlignLeft } from 'lucide-react';

interface HeaderProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const { user } = useAppSelector((state) => state.auth);

    return (
        <>
            <header className="bg-whiteColor border-b border-gray-200 shadow-xl">
                <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Left side */}
                        <div className="flex items-center">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                            >
                                <span className="sr-only">Open menu</span>
                                <AlignLeft />
                            </button>                            
                        </div>

                        {/* Right side */}
                        <div className="flex items-center space-x-4">                           
                            <div className="flex items-center space-x-3">
                                <div className="flex flex-col text-right">
                                    <span className="text-sm font-medium text-gray-900">{user?.name || 'Farmer'}</span>
                                    <span className="text-xs text-gray-500">{user?.email}</span>
                                </div>
                                <div className="h-8 w-8 bg-greenColor rounded-full flex items-center justify-center text-whiteColor font-medium">
                                    {user?.name?.charAt(0)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;