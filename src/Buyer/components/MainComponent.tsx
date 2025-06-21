import { Route, Routes } from "react-router-dom"
import BuyerDashboard from "./BuyerDashboard"

const MainComponent = () => {
    return (
        <>
            <main className="flex-1 bg-gradient-to-br from-green-50 via-white to-green-50 overflow-auto">
                <div className="max-w-7xl mx-auto">
                    <Routes>
                        <Route path="/" element={<BuyerDashboard />} />
                    </Routes>
                </div>
            </main>
        </>
    )
}

export default MainComponent