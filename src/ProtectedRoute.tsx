import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAppSelector } from './State/hooks';

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles?: string[];
    redirectTo?: string;
}

const ProtectedRoute = ({
    children,
    allowedRoles = [],
    redirectTo = '/login'
}: ProtectedRouteProps) => {

    const { isAuthenticated, user } = useAppSelector((state) => state.auth);

    // Check if user is authenticated
    if (!isAuthenticated || !user) {
        return <Navigate to={redirectTo} replace />;
    }

    // Check if user has required role
    if (
        allowedRoles.length > 0 &&
        (!user.role || !allowedRoles.includes(user.role.toLowerCase()))
    ) {
        // Redirect to appropriate dashboard based on user's actual role
        const userRole = user.role ? user.role.toLowerCase() : '';
        switch (userRole) {
            case 'admin':
                return <Navigate to="/admin" replace />;
            case 'buyer':
                return <Navigate to="/buyer" replace />;
            case 'farmer':
                return <Navigate to="/farmer" replace />;
            default:
                return <Navigate to="/" replace />;
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;