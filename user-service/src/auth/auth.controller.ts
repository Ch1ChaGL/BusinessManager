import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Param,
  Post,
  Res,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { Response } from 'express';
import { Auth } from './decorators/auth.decorators';
import { send } from 'process';

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
    console.log('Я отрабатываю - /login', dto);
    const { tokens, user } = await this.authService.login(dto);

    this.authService.setCookie(res, 'refreshToken', tokens.refreshToken);

    return res.json({ user, accessToken: tokens.accessToken });
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Get('/refresh')
  async refresh(@Body() dto: RefreshDto, @Res() res: Response) {
    console.log('Я отрабатываю - /refresh', dto);
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

  @HttpCode(200)
  @Get('/validate')
  async validateToken(
    @Headers('Authorization') authHeader: string,
    @Res() res: Response,
  ) {
    if (!authHeader) {
      return res.status(401).send({ responseBody: { active: false } });
    }

    // Remove 'Bearer ' prefix to extract token
    const token = authHeader.replace('Bearer ', '');

    try {
      const decodedToken = await this.authService.validateToken(token);
      // Optionally, you can perform additional checks or logic with decodedToken
      console.log('/validate - decodedToken', decodedToken);
      return res.send({ responseBody: { active: true } });
    } catch (err) {
      return res.status(200).send({ responseBody: { active: false } });
    }
  }
}
