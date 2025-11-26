import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-users.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('create-admin')
  async createAdmin(@Body() body: CreateUserDto) {
    const admin = await this.authService.createAdmin(body.email, body.password);
    return { message: 'Admin created', data: admin };
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    const result = await this.authService.login(body.email, body.password);
    return {
      message: 'Login successful',
      token: result.token,
      user: result.user,
    };
  }
}
