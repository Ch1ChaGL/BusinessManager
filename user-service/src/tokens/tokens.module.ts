import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from 'config/jwt.config';

@Module({
  controllers: [],
  providers: [TokensService],
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
  ],
  exports: [TokensService],
})
export class TokensModule {}
