import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Users } from '@prisma/client';

@Injectable()
export class TokensService {
  constructor(private readonly jwt: JwtService) {}

  async issueTokens(userId: string, roleId: Number) {
    const data = { userId, roleId };

    const accessToken = this.jwt.sign(data, {
      expiresIn: '15m',
    });

    const refreshToken = this.jwt.sign(data, {
      expiresIn: '15d',
    });
    return { accessToken, refreshToken };
  }

  async verifyAsync(refreshToken: string): Promise<Users> {
    return this.jwt.verifyAsync(refreshToken);
  }
}
