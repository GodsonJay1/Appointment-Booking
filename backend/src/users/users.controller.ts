import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // Create admin user
  @Post('create-admin')
  async createAdmin(@Body() body: { email: string; password: string }) {
    return this.usersService.createAdminUser(body.email, body.password);
  }

  // List all users
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  // Get single user
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  // Delete a user
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
