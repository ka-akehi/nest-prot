import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatsController } from './cat.controller';
import { CatsService } from './cats.service';
import { CatEntity } from './entities/cat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CatEntity])],
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService],
})
export class CatsModule {}
