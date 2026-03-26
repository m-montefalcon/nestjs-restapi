import { UserRole } from './user-role.enum';

export type QueryUsersFilters = {
    role?: UserRole;
    name?: {
        $regex: string;
        $options: string;
    };
    email?: {
        $regex: string;
        $options: string;
    };
};
