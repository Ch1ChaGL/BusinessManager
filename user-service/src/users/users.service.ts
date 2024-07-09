import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUsers() {
    return [
      { id: 1, name: 'Danil' },
      { id: 2, name: 'Artem' },
    ];
  }
}
