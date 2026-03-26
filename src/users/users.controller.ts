import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { GetUsersQueryDto } from './dto/get-users-query.dto/get-users-query.dto';
import { UsersService } from './users.service';

@Controller('users')
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
    findAll(@Query() query: GetUsersQueryDto) {
        return this.userService.findAll(query);
    }

    @Get(':id') // GET /users/:id
    findOne(@Param('id') id: string) {
        return this.userService.findOne(id);
    }

    @Post() // POST /users
    create(@Body() user: object) {
        return this.userService.createUser(user);
    }

    @Patch(':id') // PATCH /users/:id
    updateUser(@Param('id') id: string, @Body() userUpdate: object) {
        return this.userService.updateUser(id, userUpdate);
    }

    @Delete(':id') // DELETE /users/:id
    deleteUser(@Param('id') id: string) {
        this.userService.deleteUser(id);
    }
}
