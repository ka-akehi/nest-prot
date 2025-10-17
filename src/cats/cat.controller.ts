import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/cat.dto';
import { SearchCatQueryDto } from './dto/search-cat.dto';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  create(@Body() createCatDto: CreateCatDto) {
    return this.catsService.create(createCatDto);
  }

  @Get()
  findAll() {
    return this.catsService.findAll();
  }

  // 脆弱な検索
  @Get('search/unsafe')
  searchUnsafe(@Query('keyword') keyword?: string) {
    return this.catsService.searchUnsafe(keyword);
  }

  // 安全版検索。
  @Get('search/safe')
  searchSafe(@Query('keyword') keyword?: string) {
    return this.catsService.searchSafe(keyword);
  }

  // ワイルドカードをエスケープしてリテラル一致させる検索。
  @Get('search/safe-literal')
  searchSafeLiteral(@Query('keyword') keyword?: string) {
    return this.catsService.searchSafeLiteral(keyword);
  }

  // ORM を使って複数条件を安全に組み立てる例。
  @Get('filter/advanced')
  filterAdvanced(@Query() query: SearchCatQueryDto) {
    return this.catsService.findWithFilters(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.catsService.findOne(id);
  }
}
