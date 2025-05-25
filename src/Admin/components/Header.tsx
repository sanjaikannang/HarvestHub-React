import { Bell } from "lucide-react";

const Header = () => {

  return (
    <>
      <header className="bg-white shadow-xs border-gray-200 h-16 flex items-center justify-between px-6">
        {/* Left side */}
        <div className="flex items-center space-x-4">

        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>
        </div>
      </header>
    </>
  )
}

export default Header