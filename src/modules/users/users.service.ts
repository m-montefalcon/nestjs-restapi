import { Injectable } from '@nestjs/common';
import { GetUsersQueryDto } from './dto/get-users-query.dto/get-users-query.dto';

@Injectable()
export class UsersService {
    findAll(query: GetUsersQueryDto) {
        return query;
    }

    findOne(id: string) {
        return id;
    }

    createUser(user: object) {
        return user;
    }

    updateUser(id: string, user: object) {
        return { id, ...user };
    }

    deleteUser(id: string) {
        return id;
    }
}
