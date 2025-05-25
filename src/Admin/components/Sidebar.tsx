import { Home, LogOut } from "lucide-react";
import { useState } from "react";

const Sidebar = () => {

  const [activeItem, setActiveItem] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home }
  ];

  const handleLogout = () => {
    console.log('Logout....');
  };

  return (
    <>
      <aside className="bg-gray-900 text-white transition-all duration-300 w-64 min-h-screen flex flex-col">
        {/* Logo */}
        <div className="h-16 border-b border-gray-800 flex items-center justify-center">
          <span className="text-xl font-bold">Admin</span>
        </div>

        {/* Navigation */}
        <nav className="mt-6 flex-1">
          <ul className="space-y-2 px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveItem(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${activeItem === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-3 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors text-gray-300 hover:bg-red-600 hover:text-white"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar