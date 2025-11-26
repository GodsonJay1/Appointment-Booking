import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async createAdmin(email: string, password: string) {
    const exists = await this.prisma.user.findUnique({ where: { email } });
    if (exists) throw new BadRequestException('Admin already exists');

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await this.prisma.user.create({
      data: { email, password: hashedPassword, isAdmin: true },
    });

    return {
      message: 'Admin created successfully',
      admin: { id: admin.id, email: admin.email },
    };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.isAdmin) throw new BadRequestException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new BadRequestException('Invalid credentials');

    const token = jwt.sign(
      { id: user.id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    return {
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email, isAdmin: user.isAdmin },
    };
  }
}
