import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { hash } from 'argon2';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(dto: AuthDto) {
    const user = await this.prisma.users.create({
      data: {
        ...dto,
        password: await hash(dto.password),
      },
    });

    return user;
  }
}
