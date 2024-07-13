import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('/register')
  async register(@Body() dto: AuthDto, @Res() res: Response) {
    const { tokens, user } = await this.authService.register(dto);

    this.authService.setCookie(res, 'refreshToken', tokens.refreshToken);

    return res.json({ user, accessToken: tokens.accessToken });
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('/login')
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const { tokens, user } = await this.authService.login(dto);

    this.authService.setCookie(res, 'refreshToken', tokens.refreshToken);

    return res.json({ user, accessToken: tokens.accessToken });
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Get('/refresh')
  async refresh(@Body() dto: RefreshDto, @Res() res: Response) {
    const { tokens, user } = await this.authService.getNewTokens(dto);

    this.authService.setCookie(res, 'refreshToken', tokens.refreshToken);

    return res.json({ user, accessToken: tokens.accessToken });
  }

  @Post('/logout')
  async logout() {}

  @Get('/activation/:link')
  async activationLink(@Param('link') link: string, @Res() res: Response) {
    await this.authService.activate(link);

    return res.redirect(process.env.CLIENT_URL);
  }
}
