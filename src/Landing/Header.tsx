import { useNavigate } from "react-router-dom";

const Header = () => {

    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login');
    }


    const handleRegister = () => {
        navigate('/register');
    }

    return (
        <>
            <header className="bg-whiteColor shadow-xs border-gray-500 h-16 flex items-center justify-between px-6">
                {/* Left side */}
                <div className="flex items-center space-x-4">
                    <h1>Harvest Hub</h1>
                </div>

                {/* Right side */}
                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleLogin}
                        className="px-6 py-1.5 rounded-md bg-greenColor text-whiteColor cursor-pointer">
                        Login
                    </button>

                    <button
                        onClick={handleRegister}
                        className="px-6 py-1.5 rounded-md bg-greenColor text-whiteColor cursor-pointer">
                        Register
                    </button>
                </div>
            </header>
        </>
    )
}

export default Header