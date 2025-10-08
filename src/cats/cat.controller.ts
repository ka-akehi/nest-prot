import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { type Response } from 'express';
import { CatsService } from 'src/cats/cats.service';
import { CreateCatDto } from 'src/cats/dto/cat.dto';
import { Cat } from 'src/cats/interface/cat.interface';

@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
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
