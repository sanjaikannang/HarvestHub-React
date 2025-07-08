import { Route, Routes, useLocation, useNavigate } from "react-router-dom"
import BuyerDashboard from "./BuyerDashboard"
import Products from "./Products"
import Notification from "./Notification"
import NavigationBar from "./NavigationBar"
import Bidding from "./Bidding/Bidding"
import Chatting from "./Chatting"


const MainComponent = () => {

    const location = useLocation();
    const navigate = useNavigate();

    // Function to determine if navigation bar should be shown
    const shouldShowNavigationBar = () => {
        const path = location.pathname;
        return path.includes('/buyer/products') || path.includes('/buyer/bidding/');
    };

    // Function to get navigation title
    const getNavigationTitle = () => {
        const path = location.pathname;
        if (path.includes('/buyer/bidding/')) {
            return 'Product Details';
        } else if (path.includes('/buyer/products')) {
            return 'All Products';
        }
        return '';
    };

    // Function to determine if back button should be shown
    const shouldShowBackButton = () => {
        return location.pathname.includes('/buyer/bidding/');
    };

    // Handle back button click
    const handleBackClick = () => {
        navigate('/buyer/products');
    };

    return (
        <>
            <main className="flex-1 bg-gradient-to-br from-green-50 via-white to-green-50 overflow-auto">
                {/* Navigation Bar - Only show for Products and Bidding pages */}
                {shouldShowNavigationBar() && (
                    <div className="sticky top-0 z-40 bg-gray-50">
                        <NavigationBar
                            title={getNavigationTitle()}
                            showBackButton={shouldShowBackButton()}
                            onBackClick={handleBackClick}
                        />
                    </div>
                )}

                <div className="max-w-9xl mx-auto">
                    <Routes>
                        <Route path="/" element={<BuyerDashboard />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/bidding/:productId" element={<Bidding />} />
                        <Route path="/notification" element={<Notification />} />
                        <Route path="/chatting" element={<Chatting />} />
                    </Routes>
                </div>
            </main>
        </>
    )
}

export default MainComponent