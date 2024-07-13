import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma.service';
import { TokensModule } from 'src/tokens/tokens.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [TokensModule, MailModule],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
})
export class AuthModule {}
