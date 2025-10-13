import { Test, TestingModule } from '@nestjs/testing';
import { CatsService } from './cats.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CatsService', () => {
  let service: CatsService;
  let prisma: {
    cat: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      cat: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatsService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<CatsService>(CatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a cat using Prisma', async () => {
    const dto = { name: 'Milo', age: 2, breed: 'Tabby' };
    const created = { id: 1, ...dto };
    prisma.cat.create.mockResolvedValue(created);

    const result = await service.create(dto);

    expect(prisma.cat.create).toHaveBeenCalledWith({ data: dto });
    expect(result).toEqual(created);
  });

  it('returns all cats', async () => {
    const cats = [{ id: 1, name: 'Luna', age: 3, breed: 'Siamese' }];
    prisma.cat.findMany.mockResolvedValue(cats);

    const result = await service.findAll();

    expect(prisma.cat.findMany).toHaveBeenCalled();
    expect(result).toEqual(cats);
  });

  it('finds a cat by id', async () => {
    const cat = { id: 2, name: 'Leo', age: 4, breed: 'Bengal' };
    prisma.cat.findUnique.mockResolvedValue(cat);

    const result = await service.findOne(2);

    expect(prisma.cat.findUnique).toHaveBeenCalledWith({ where: { id: 2 } });
    expect(result).toEqual(cat);
  });
});
