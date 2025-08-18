import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [JwtModule.register({}), EmailModule],
  providers: [AuthService, PrismaService],
  controllers: [AuthController],
})
export class AuthModule {}