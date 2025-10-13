import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCatDto } from './dto/cat.dto';
import { CatEntity } from './entities/cat.entity';

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(CatEntity)
    private readonly catsRepository: Repository<CatEntity>,
  ) {}

  create(createCatDto: CreateCatDto) {
    const cat = this.catsRepository.create(createCatDto);
    return this.catsRepository.save(cat);
  }

  findAll() {
    return this.catsRepository.find();
  }

  findOne(id: number) {
    return this.catsRepository.findOneBy({ id });
  }
}
