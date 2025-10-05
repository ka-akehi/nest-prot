import {
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { type Response } from 'express';

@Controller('cats')
export class CatsController {
  @Post()
  @Header('Cache-Control', 'no-store')
  @HttpCode(HttpStatus.OK)
  create() {
    return 'This action adds a new cat';
  }

  @Get('abcd/*')
  findAll(): string {
    return 'This action returns all cats';
  }

  @Get(':id')
  findOne(@Param('id') id: string): string {
    console.log(id);
    return `This action returns a #${id} cat`;
  }

  @Get()
  fetch(@Query('age') age: number, @Query('breed') breed: string) {
    return `This action returns all cats filtered by age: ${age} and breed: ${breed}`;
  }

  @Post()
  postExample(@Res() res: Response) {
    res.status(HttpStatus.CREATED).send();
  }

  @Get()
  getExample(@Res() res: Response) {
    res.status(HttpStatus.OK).json([]);
  }
}
