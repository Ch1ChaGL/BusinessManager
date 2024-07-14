import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TestModule } from './test/test.module';

@Module({
  imports: [
    TestModule,
    ConfigModule.forRoot({
      envFilePath: `${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
