import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../State/hooks";
import { 
    setProducts, 
    setLoading, 
    setError
} from "../../State/Slices/adminSlice";
import { ProductCard } from "../../Common/ui/Card";
import { getAllProductsAPI } from "../../Services/adminAPI";

const MainComponent: React.FC = () => {
    const dispatch = useAppDispatch();
    const { products, isLoading, error } = useAppSelector((state) => state.admin);

    // Fetch products on component mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Set loading to true
                dispatch(setLoading(true));

                const response = await getAllProductsAPI();

                console.log("Fetched products:", response.product);

                // Set products data
                // dispatch(setProducts(response.product));
                
            } catch (error) {
                console.log("Error fetching products:", error);
                
                // Set error state
                const errorMessage = error instanceof Error ? error.message : 'Failed to fetch products';
                dispatch(setError(errorMessage));
                
            } finally {
                // Always set loading to false
                dispatch(setLoading(false));
            }
        };

        fetchProducts();
    }, []); // Only depend on dispatch

    return (
        <>
            <main className="flex-1 p-6 bg-gray-50 overflow-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Management</h1>
                    <p className="text-gray-600">Manage all products in the system</p>
                </div>

                {/* Error State */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <span className="ml-2 text-gray-600">Loading products...</span>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !error && products.length === 0 && (
                    <div className="flex justify-center items-center py-12">
                        <div className="text-center">
                            <p className="text-gray-500 text-lg mb-2">No products found</p>
                            <p className="text-gray-400">Try adjusting your filters or add some products</p>
                        </div>
                    </div>
                )}

                {/* Products Grid */}
                {!isLoading && !error && products.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
                        {products.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={response.product}
                            />
                        ))}
                    </div>
                )}
            </main>
        </>
    )
}

export default MainComponent;