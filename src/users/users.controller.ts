import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { GetUsersQueryDto } from './dto/get-users-query.dto/get-users-query.dto';

@Controller('users')
export class UsersController {
    /**
     * Routes:
     * GET /users
     * GET /users/:id
     * POST /users
     * PATCH /users/:id
     * DELETE /users/:id
     */

    @Get() // GET /users
    findAll(@Query('role') query: GetUsersQueryDto) {
        return [query];
    }

    @Get('interns') // GET /users/interns
    findAllInters() {
        return [];
    }

    @Get(':id') // GET /users/:id
    findOne(@Param('id') id: string) {
        return { id };
    }

    @Post() // POST /users
    create(@Body() user: object) {
        return user;
    }

    @Patch(':id') // PATCH /users/:id
    updateUser(@Param('id') id: string, @Body() userUpdate: object) {
        return { id, ...userUpdate };
    }

    @Delete(':id') // DELETE /users/:id
    deleteUser(@Param('id') id: string) {
        return { id, msg: 'deleted' };
    }
}
