import { Controller, Get, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/common/filter/http-exception.filter';

@Controller('users')
@UseFilters(HttpExceptionFilter) // ← コントローラ全体に適用
export class UsersController {
  @Get()
  getUsers() {
    throw new Error('Something went wrong!');
  }
}
