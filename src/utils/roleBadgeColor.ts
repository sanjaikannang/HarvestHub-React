import { UserRole } from "./enum";

export const getRoleBadgeColor = (role: UserRole) => {
    
    if (!role || typeof role !== 'string') {
        return 'bg-gray-100 text-gray-800';
    }

    switch (role.toLowerCase()) {
        case UserRole.ADMIN:
            return 'bg-red-100 text-red-800';
        case UserRole.FARMER:
            return 'bg-green-100 text-green-800';
        case UserRole.BUYER:
            return 'bg-blue-100 text-blue-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};