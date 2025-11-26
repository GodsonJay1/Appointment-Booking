import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Create a new admin user
  async createAdminUser(email: string, password: string) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new BadRequestException('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: { email, password: hashedPassword, isAdmin: true },
    });
  }

  // Get all users
  async findAll() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, email: true, isAdmin: true, createdAt: true },
    });
  }

  // Get a single user by ID
  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, isAdmin: true, createdAt: true },
    });
  }

  // Optional: delete a user
  async deleteUser(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
