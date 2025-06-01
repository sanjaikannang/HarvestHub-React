import React from 'react';
import { Route, Routes } from 'react-router-dom';
import FarmerDashboard from '../components/FarmerDashboard';
import MyProduct from '../components/MyProduct';
import Orders from '../components/Orders';
import Bidding from '../components/Bidding';
import CreateProduct from './CreateProduct/CreateProduct';

const MainComponent: React.FC = () => {
    return (
        <main className="flex-1 bg-gradient-to-br from-green-50 via-white to-green-50 overflow-auto">
            <div className="max-w-7xl mx-auto">
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

export default MainComponent;