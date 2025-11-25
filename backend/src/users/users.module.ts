import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [UsersService, PrismaService],
  controllers: [UsersController],
  exports: [UsersService], // export so other modules can inject UsersService
})
export class UsersModule {}
