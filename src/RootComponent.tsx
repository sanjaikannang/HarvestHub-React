import { useEffect } from "react";
import { useAppDispatch } from "./State/hooks";
import { restoreAuthFromStorage } from "./State/Slices/authSlice";
import { Route, Routes, BrowserRouter as Router, Navigate } from "react-router-dom"
import LandingPage from "./Landing/LandingPage"
import RegisterLayout from "./Auth/layout/RegisterLayout"
import LoginLayout from "./Auth/layout/LoginLayout"
import AdminLayout from "./Admin/layout/AdminLayout"
import BuyerLayout from "./Buyer/layout/BuyerLayout"
import FarmerLayout from "./Farmer/layout/FarmerLayout"
import ProtectedRoute from "./ProtectedRoute";


const RootComponent = () => {

    const dispatch = useAppDispatch();

    // Restore auth state from localStorage on app load
    useEffect(() => {
        dispatch(restoreAuthFromStorage());
    }, [dispatch]);

    return (
        <>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/register" element={<RegisterLayout />} />
                    <Route path="/login" element={<LoginLayout />} />

                    {/* Protected Routes */}
                    <Route path="/admin/*" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>} />
                    <Route path="/buyer/*" element={<ProtectedRoute allowedRoles={['buyer']}><BuyerLayout /></ProtectedRoute>} />

                    <Route path="/farmer/*" element={<ProtectedRoute allowedRoles={['farmer']}><FarmerLayout /></ProtectedRoute>} />

                    {/* Catch all route - redirect to home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </>
    )
}

export default RootComponent