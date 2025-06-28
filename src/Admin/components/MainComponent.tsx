import { Route, Routes } from 'react-router-dom';
import AllProducts from './AllProducts';
import AllUsers from './AllUsers';
import Bidding from './Bidding';
import Chatting from './Chatting';
import Dashboard from './Dashboard';

const MainComponent = () => {

    return (
        <>
            <div className="flex-1 overflow-auto">
                <div className="max-w-9xl mx-auto">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/all-products" element={<AllProducts />} />
                        <Route path="/all-users" element={<AllUsers />} />
                        <Route path="/bidding" element={<Bidding />} />
                        <Route path="/chatting" element={<Chatting />} />
                    </Routes>
                </div>
            </div>
        </>
    );
};

export default MainComponent;