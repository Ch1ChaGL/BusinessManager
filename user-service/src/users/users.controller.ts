import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  async getAllUsers() {
    return [
      { id: 1, name: 'danil' },
      { id: 2, name: 'Alen' },
    ];
  }
}
