import { Route, Routes } from "react-router-dom"
import BuyerDashboard from "./BuyerDashboard"
import Bidding from "./Bidding"
import Products from "./Products"
import Notification from "./Notification"

const MainComponent = () => {
    return (
        <>
            <main className="flex-1 bg-gradient-to-br from-green-50 via-white to-green-50 overflow-auto">
                <div className="max-w-9xl mx-auto">
                    <Routes>
                        <Route path="/" element={<BuyerDashboard />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/bidding/:productId" element={<Bidding />} />
                        <Route path="/notification" element={<Notification />} />
                    </Routes>
                </div>
            </main>
        </>
    )
}

export default MainComponent