export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
    SUPER_USER = 'SUPER_USER',
}
export const UserRoleLabel: Record<UserRole, string> = {
    [UserRole.USER]: 'User',
    [UserRole.ADMIN]: 'Admin',
    [UserRole.SUPER_USER]: 'Super User',
};
