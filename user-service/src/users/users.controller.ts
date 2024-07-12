import { Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  async getAllUsers() {
    return await this.usersService.getAllUsers();
  }
}
