import React from 'react';
import { Route, Routes } from 'react-router-dom';
import FarmerDashboard from '../components/FarmerDashboard';
import CreateProduct from '../components/CreateProduct';
import MyProduct from '../components/MyProduct';
import Orders from '../components/Orders';
import Bidding from '../components/Bidding';

const MainContent: React.FC = () => {
    return (
        <main className="flex-1 bg-gray-50 overflow-auto">
            <div className="max-w-7xl mx-auto px-4">
                <Routes>
                    <Route path="/" element={<FarmerDashboard />} />
                    <Route path="/products" element={<MyProduct />} />
                    <Route path="/create-product" element={<CreateProduct />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/bidding" element={<Bidding />} />
                </Routes>
            </div>
        </main>
    );
};

export default MainContent;