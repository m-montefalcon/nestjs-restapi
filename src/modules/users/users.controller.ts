import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from 'src/definitions/users/user-role.enum';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
    constructor(private readonly userService: UsersService) {}
    /**
     * Routes:
     * GET /users
     * GET /users/:id
     * POST /users
     * PATCH /users/:id
     * DELETE /users/:id
     */

    @Get() // GET /users
    @Roles(UserRole.ADMIN, UserRole.USER)
    findAll(@Query() query: GetUsersQueryDto) {
        return this.userService.findAll(query);
    }

    @Get(':id') // GET /users/:id
    @Roles(UserRole.ADMIN, UserRole.USER)
    findOne(@Param('id') id: string) {
        return this.userService.findOne(id);
    }

    @Post()
    @Roles(UserRole.ADMIN)
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }

    @Patch(':id') // PATCH /users/:id
    @Roles(UserRole.ADMIN)
    updateUser(@Param('id') id: string, @Body() userUpdate: UpdateUserDto) {
        return this.userService.updateUser(id, userUpdate);
    }

    @Delete(':id') // DELETE /users/:id
    @Roles(UserRole.ADMIN)
    deleteUser(@Param('id') id: string) {
        return this.userService.deleteUser(id);
    }
}
