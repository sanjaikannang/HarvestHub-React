import { Route, Routes } from 'react-router-dom';
import AllProducts from './AllProducts';
import ProductDetails from './ProductDetails';

const MainComponent = () => {
    return (
        <>
            <div className="flex-1 overflow-auto">
                <div className="max-w-7xl mx-auto">
                    <Routes>
                        <Route path="/" element={<AllProducts />} />
                        <Route path="/product/:productId" element={<ProductDetails />} />
                    </Routes>
                </div>
            </div>
        </>
    );
};

export default MainComponent;