import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CatsService } from './cats.service';
import { CatEntity } from './entities/cat.entity';

describe('CatsService', () => {
  let service: CatsService;
  let repository: jest.Mocked<Partial<Repository<CatEntity>>>;

  beforeEach(async () => {
    repository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOneBy: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatsService,
        {
          provide: getRepositoryToken(CatEntity),
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<CatsService>(CatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a cat using the repository', async () => {
    const dto = { name: 'Milo', age: 2, breed: 'Tabby' };
    (repository.create as jest.Mock).mockReturnValue(dto as CatEntity);
    (repository.save as jest.Mock).mockResolvedValue({ id: 1, ...dto });

    const result = await service.create(dto);

    expect(repository.create).toHaveBeenCalledWith(dto);
    expect(repository.save).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ id: 1, ...dto });
  });

  it('returns all cats', async () => {
    const cats = [{ id: 1, name: 'Luna', age: 3, breed: 'Siamese' }];
    (repository.find as jest.Mock).mockResolvedValue(cats as CatEntity[]);

    const result = await service.findAll();

    expect(repository.find).toHaveBeenCalled();
    expect(result).toEqual(cats);
  });

  it('finds a cat by id', async () => {
    const cat = { id: 2, name: 'Leo', age: 4, breed: 'Bengal' };
    (repository.findOneBy as jest.Mock).mockResolvedValue(cat as CatEntity);

    const result = await service.findOne(2);

    expect(repository.findOneBy).toHaveBeenCalledWith({ id: 2 });
    expect(result).toEqual(cat);
  });
});
