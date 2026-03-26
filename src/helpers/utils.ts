import { PaginationQueryDto } from 'src/definitions/pagination/pagination-query.dto';
import { QueryUsersFilters } from 'src/definitions/users/get-users-query';
import { GetUsersQueryDto } from 'src/modules/users/dto/get-users-query.dto';

/**
 * Helper to simplify building of User Query Filters Request
 * @param query Request Parameter Query for findAll in UserServices
 * @returns Returns filters object with active query params on it
 */

export function buildUserQueryFilters(query: GetUsersQueryDto) {
    const filters: QueryUsersFilters = {};

    if (query.name) {
        // Match any name that contains query.name, case-insensitive
        filters.name = { $regex: query.name, $options: 'i' };
    }

    if (query.email) {
        filters.email = { $regex: query.email, $options: 'i' };
    }

    if (query.role) {
        filters.role = query.role; // exact match
    }

    return filters;
}

export function buildPagination(query: PaginationQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;
    return { page, limit, skip };
}
