import { Route, Routes, useParams } from 'react-router-dom';
import AllProducts from './AllProducts';
import ProductDetails from './ProductDetails';
import AllUsers from './AllUsers';
import BiddingComponent from './BiddingComponent';

const MainComponent = () => {

    const { productId } = useParams();

    return (
        <>
            <div className="flex-1 overflow-auto">
                <div className="max-w-9xl mx-auto">
                    <Routes>
                        <Route path="/" element={<AllProducts />} />
                        <Route path="/product/:productId" element={<ProductDetails />} />
                        <Route path="/all-users" element={<AllUsers />} />
                        <Route path="/bidding/:productId" element={<BiddingComponent productId={productId} />} />
                    </Routes>
                </div>
            </div>
        </>
    );
};

export default MainComponent;