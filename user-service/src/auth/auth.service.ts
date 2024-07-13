import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { Users } from '@prisma/client';
import { v4 } from 'uuid';
import { MailService } from 'src/mail/mail.service';
import { TokensService } from 'src/tokens/tokens.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly tokensService: TokensService,
  ) {}

  async register(dto: AuthDto) {
    const oldUser = await this.prisma.users.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (oldUser)
      throw new BadRequestException('User with this email already exists');

    const activationLink = v4();

    const user = await this.prisma.users.create({
      data: {
        ...dto,
        password: await hash(dto.password),
        activation_link: activationLink,
      },
    });

    await this.mailService.sendActivationMail(
      user.email,
      `${process.env.API_URL}auth/activation/${activationLink}`,
    );

    const tokens = await this.tokensService.issueTokens(
      user.user_id,
      user.role_id,
    );

    return {
      user: this.getUserFields(user),
      tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto);

    const tokens = await this.tokensService.issueTokens(
      user.user_id,
      user.role_id,
    );

    return {
      user: this.getUserFields(user),
      tokens,
    };
  }

  async getNewTokens(dto: RefreshDto) {
    const result = await this.tokensService.verifyAsync(dto.refreshToken);
    if (!result) throw new UnauthorizedException('Invalid refresh token');

    const user = await this.prisma.users.findUnique({
      where: {
        user_id: result.user_id,
      },
    });

    const tokens = await this.tokensService.issueTokens(
      user.user_id,
      user.role_id,
    );

    return {
      user: this.getUserFields(user),
      tokens,
    };
  }

  private getUserFields(user: Users): Omit<Users, 'password'> {
    const { password, ...rest } = user;
    return {
      ...rest,
    };
  }

  private async validateUser(dto: LoginDto) {
    const user = await this.prisma.users.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const isValid = await verify(user.password, dto.password);
    if (!isValid) throw new UnauthorizedException('Wrong password');

    return user;
  }

  setCookie(res: Response, key: string, value) {
    res.cookie(key, value, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
  }

  async activate(activationLink: string) {
    const user = await this.prisma.users.findUnique({
      where: {
        activation_link: activationLink,
      },
    });

    if (!user) throw new BadRequestException('Invalid activation link');

    await this.prisma.users.update({
      where: { user_id: user.user_id },
      data: { ...user, isActivated: true },
    });
  }
}
