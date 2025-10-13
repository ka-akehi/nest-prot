import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCatDto } from './dto/cat.dto';

@Injectable()
export class CatsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCatDto: CreateCatDto) {
    return this.prisma.cat.create({ data: { ...createCatDto } });
  }

  findAll() {
    return this.prisma.cat.findMany();
  }

  findOne(id: number) {
    return this.prisma.cat.findUnique({ where: { id } });
  }
}
