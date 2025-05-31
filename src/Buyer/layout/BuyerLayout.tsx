import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../State/hooks";
import { clearCredentials } from "../../State/Slices/authSlice";

const BuyerLayout = () => {

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleLogout = () => {
        dispatch(clearCredentials());
        navigate('/login');
    };

    return (
        <>
            <div className="flex h-screen justify-center items-center">
                <h1>BuyerLayout</h1>
                <br />
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                >Logout</button>
            </div>
        </>
    )
}

export default BuyerLayout