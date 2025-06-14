import { Route, Routes } from 'react-router-dom';
import AllProducts from './AllProducts';
import ProductDetails from './ProductDetails';
import AllUsers from './AllUsers';

const MainComponent = () => {
    return (
        <>
            <div className="flex-1 overflow-auto">
                <div className="max-w-7xl mx-auto">
                    <Routes>
                        <Route path="/" element={<AllProducts />} />
                        <Route path="/product/:productId" element={<ProductDetails />} />
                        <Route path="/all-users" element={<AllUsers />} />
                    </Routes>
                </div>
            </div>
        </>
    );
};

export default MainComponent;