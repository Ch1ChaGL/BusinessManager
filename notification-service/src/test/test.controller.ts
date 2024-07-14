import { Controller, Get, HttpCode } from '@nestjs/common';
import { TestService } from './test.service';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @HttpCode(200)
  @Get('/')
  async getTest() {
    console.log('Я отрабатываю - /test');
    return [
      { id: 1, name: 'Вася' },
      { id: 2, name: 'Петя' },
    ];
  }
}
