import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCatDto } from './dto/cat.dto';
import { SearchCatQueryDto } from './dto/search-cat.dto';

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

  searchUnsafe(keyword = '') {
    // SQL インジェクションを意図的に許容する脆弱な検索。
    const sql = `SELECT id, name, age, breed FROM "cats" WHERE name LIKE '%${keyword}%' OR breed LIKE '%${keyword}%' ORDER BY id`;
    return this.prisma.$queryRawUnsafe(sql);
  }

  // 任意の SQL を埋め込まれることを防ぐが、%や_などのワイルドカードは有効。
  searchSafe(keyword = '') {
    const likeTerm = keyword ? `%${keyword}%` : '%';

    return this.prisma.$queryRaw<
      { id: number; name: string; age: number; breed: string }[]
    >`
      SELECT id, name, age, breed
      FROM "cats"
      WHERE name LIKE ${likeTerm}
         OR breed LIKE ${likeTerm}
      ORDER BY id
    `;
  }

  // LIKE ワイルドカードを無効化し、リテラル文字列として検索する安全版。
  searchSafeLiteral(keyword = '') {
    if (!keyword) {
      return this.prisma.cat.findMany({ orderBy: { id: 'asc' } });
    }

    const escaped = keyword.replace(/([\\%_])/g, '\\$1');
    const likeTerm = `%${escaped}%`;

    return this.prisma.$queryRaw<
      { id: number; name: string; age: number; breed: string }[]
    >`
      SELECT id, name, age, breed
      FROM "cats"
      WHERE (name LIKE ${likeTerm} ESCAPE '\\')
         OR (breed LIKE ${likeTerm} ESCAPE '\\')
      ORDER BY id
    `;
  }

  // Prisma を使い、動的フィルタを安全に構築するパターンを示す。
  findWithFilters(query: SearchCatQueryDto) {
    const { keyword, minAge, maxAge, sortBy, order } = query;
    const where: Prisma.CatWhereInput = {};

    if (keyword) {
      where.OR = [
        { name: { contains: keyword } },
        { breed: { contains: keyword } },
      ];
    }

    const ageFilters: Prisma.IntFilter = {};
    if (minAge !== undefined && !Number.isNaN(minAge)) {
      ageFilters.gte = minAge;
    }

    if (maxAge !== undefined && !Number.isNaN(maxAge)) {
      ageFilters.lte = maxAge;
    }

    if (Object.keys(ageFilters).length) {
      where.age = ageFilters;
    }

    const selectedSortColumn = sortBy ? sortBy : 'id';
    const sortDirection = order ? 'asc' : 'desc';

    return this.prisma.cat.findMany({
      where,
      orderBy: { [selectedSortColumn]: sortDirection },
    });
  }
}
