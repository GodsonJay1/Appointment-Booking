import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-users.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async createUser(@Body() body: CreateUserDto) {
    const user = await this.usersService.createAdminUser(body.email, body.password);
    return { message: 'User created', data: user };
  }

  @Get()
  async findAll() {
    return { data: await this.usersService.findAll() };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return { data: await this.usersService.findById(id) };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.usersService.deleteUser(id);
    return { message: 'User deleted' };
  }
}

