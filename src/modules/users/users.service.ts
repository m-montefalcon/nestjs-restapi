import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { User, UserDocument } from './schemas/user.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { buildPagination, buildUserQueryFilters } from 'src/helpers/utils';
import { PaginatedResponse } from 'src/definitions/pagination/paginated-response';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from '../auth/dto/register.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async findAll(query: GetUsersQueryDto): Promise<PaginatedResponse<User>> {
        const filters = buildUserQueryFilters(query);
        const { page, limit, skip } = buildPagination(query);
        const [users, total] = await Promise.all([
            this.userModel
                .find(filters)
                .collation({ locale: 'en', strength: 2 }) // Case sensitive querying
                .select('-password')
                .skip(skip)
                .limit(limit)
                .exec(),
            this.userModel.countDocuments(filters).exec(),
        ]);
        return {
            data: users,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findOne(id: string): Promise<User> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid user ID');
        }

        const user = await this.userModel
            .findById(id)
            .select('-password -createdAt -updatedAt')
            .exec();

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const user = new this.userModel(createUserDto);
        return user.save();
    }

    async updateUser(id: string, userBody: UpdateUserDto): Promise<User> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid user ID');
        }
        const updatedUser = await this.userModel
            .findOneAndUpdate(
                { _id: id }, // Filter by ID
                userBody, // Update fields
                { returnDocument: 'after', runValidators: true }, // Return updated doc & run schema validators
            )
            .exec();

        if (!updatedUser) {
            throw new NotFoundException('User not found');
        }

        return updatedUser;
    }

    async deleteUser(id: string): Promise<void> {
        const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
        if (!deletedUser) throw new NotFoundException(`User ${id} not found`);
    }

    public async findByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email }).exec();
    }

    async createWithHashedPassword(dto: RegisterDto): Promise<UserDocument> {
        const isExistingUserByEmail = await this.findByEmail(dto.email);
        console.log(isExistingUserByEmail);
        if (isExistingUserByEmail) {
            if (isExistingUserByEmail) throw new ConflictException('Email already in use');
        }
        const hashed = await bcrypt.hash(dto.password, 12);
        const user = new this.userModel({ ...dto, password: hashed });
        return user.save();
    }
}
