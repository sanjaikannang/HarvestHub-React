import { clearCredentials } from "../../State/Slices/authSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../State/hooks";
import React from "react";
import {
  Gavel,
  LayoutDashboard,
  LogOut,
  MessageSquareMore,
  PackageCheck,
  Users,
} from 'lucide-react';

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
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'All Products', href: '/admin/all-products', icon: PackageCheck },
    { name: 'All Users', href: '/admin/all-users', icon: Users },
    { name: 'Bidding', href: '/admin/bidding', icon: Gavel },
    { name: 'Chatting', href: '/admin/chatting', icon: MessageSquareMore },
  ];

  const isActive = (path: string) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    if (path !== '/admin' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = () => {
    dispatch(clearCredentials());
    navigate('/login');
  };

  return (
    <>
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-whiteColor shadow-lg transform transition-transform duration-300 ease-in-out flex flex-col`}>

        {/* Logo */}
        <div className="h-16 flex items-center justify-center flex-shrink-0">
          <h1 className="text-xl font-semibold text-gray-900">HarvestHub</h1>
        </div>

        {/* Navigation */}
        <div className="flex-1 flex flex-col">
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
              className="group flex items-center w-full px-3 py-3 text-sm font-medium text-gray-600 hover:bg-lightredColor hover:text-darkredColor transition-colors rounded-md"
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
          className="lg:hidden fixed inset-0 z-40 bg-opacity-25 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  )
}

export default Sidebar