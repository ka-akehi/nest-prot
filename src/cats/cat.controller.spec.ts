import { Test, TestingModule } from '@nestjs/testing';
import { CatsController } from './cat.controller';
import { CatsService } from './cats.service';

describe('CatController', () => {
  let controller: CatsController;
  let service: jest.Mocked<Partial<CatsService>>;

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatsController],
      providers: [{ provide: CatsService, useValue: service }],
    }).compile();

    controller = module.get<CatsController>(CatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('creates a cat via the service', async () => {
    const dto = { name: 'Milo', age: 2, breed: 'Tabby' };
    const created = { id: 1, ...dto };
    (service.create as jest.Mock).mockResolvedValue(created);

    const result = await controller.create(dto);

    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(created);
  });

  it('returns all cats from the service', async () => {
    const cats = [{ id: 1, name: 'Luna', age: 3, breed: 'Siamese' }];
    (service.findAll as jest.Mock).mockResolvedValue(cats as any);

    const result = await controller.findAll();

    expect(service.findAll).toHaveBeenCalled();
    expect(result).toEqual(cats);
  });

  it('returns a specific cat', async () => {
    const cat = { id: 2, name: 'Leo', age: 4, breed: 'Bengal' };
    (service.findOne as jest.Mock).mockResolvedValue(cat as any);

    const result = await controller.findOne(2);

    expect(service.findOne).toHaveBeenCalledWith(2);
    expect(result).toEqual(cat);
  });
});
