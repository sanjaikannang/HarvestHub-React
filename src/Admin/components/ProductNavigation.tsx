import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductNavigationProps {
    currentProductId: string;
    products: Array<{ _id: string; name: string }>;
    onNavigate?: (productId: string) => void;
}

const ProductNavigation: React.FC<ProductNavigationProps> = ({
    currentProductId,
    products,
    onNavigate
}) => {
    const navigate = useNavigate();
    
    const currentIndex = products.findIndex(product => product._id === currentProductId);
    const hasPrevious = currentIndex > 0;
    const hasNext = currentIndex < products.length - 1;
    
    const previousProduct = hasPrevious ? products[currentIndex - 1] : null;
    const nextProduct = hasNext ? products[currentIndex + 1] : null;

    const handleNavigation = (productId: string) => {
        if (onNavigate) {
            onNavigate(productId);
        } else {
            navigate(`/admin/product/${productId}`);
        }
    };

    if (products.length <= 1) {
        return null;
    }

    return (
        <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-lg shadow-sm border">
            <div className="flex-1">
                {previousProduct ? (
                    <button
                        onClick={() => handleNavigation(previousProduct._id)}
                        className="flex items-center text-green-600 hover:text-green-700 font-medium transition-colors group"
                    >
                        <ChevronLeft size={20} className="mr-1 group-hover:-translate-x-1 transition-transform" />
                        <div className="text-left">
                            <div className="text-xs text-gray-500 uppercase tracking-wide">Previous</div>
                            <div className="truncate max-w-[200px]">{previousProduct.name}</div>
                        </div>
                    </button>
                ) : (
                    <div className="text-gray-400 text-sm">No previous product</div>
                )}
            </div>

            <div className="flex-shrink-0 px-4">
                <div className="text-center">
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Product</div>
                    <div className="text-sm font-medium text-gray-700">
                        {currentIndex + 1} of {products.length}
                    </div>
                </div>
            </div>

            <div className="flex-1 flex justify-end">
                {nextProduct ? (
                    <button
                        onClick={() => handleNavigation(nextProduct._id)}
                        className="flex items-center text-green-600 hover:text-green-700 font-medium transition-colors group"
                    >
                        <div className="text-right">
                            <div className="text-xs text-gray-500 uppercase tracking-wide">Next</div>
                            <div className="truncate max-w-[200px]">{nextProduct.name}</div>
                        </div>
                        <ChevronRight size={20} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </button>
                ) : (
                    <div className="text-gray-400 text-sm text-right">No next product</div>
                )}
            </div>
        </div>
    );
};

export default ProductNavigation;