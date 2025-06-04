import { Toaster } from 'react-hot-toast'

const CustomToaster = () => (
    <Toaster
        position="top-center"
        toastOptions={{
            duration: 5000,
            className:
                'bg-whiteColor text-gray-800 border border-gray-200 rounded-md shadow-md',
            success: {
                className:
                    'border border-green-500 text-green-600',
                iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                },
            },
            error: {
                className:
                    'border border-red-500 text-red-600',
                iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                },
            },
        }}
    />
);

export default CustomToaster;
