import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Users } from '@prisma/client';

@Injectable()
export class TokensService {
  constructor(private readonly jwt: JwtService) {}

  async issueTokens(user_id: string, role_id: Number) {
    const data = { user_id, role_id };

    const accessToken = this.jwt.sign(data, {
      expiresIn: '15m',
    });

    const refreshToken = this.jwt.sign(data, {
      expiresIn: '15d',
    });
    return { accessToken, refreshToken };
  }

  async verifyAsync(
    token: string,
  ): Promise<Pick<Users, 'user_id' | 'role_id'>> {
    return this.jwt.verifyAsync(token);
  }
}
