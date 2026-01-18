import { DataSource } from 'typeorm';
import { ProductionsService } from './productions.service';
import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException, Logger } from '@nestjs/common';

const mockQueyBuilder = {
  select: jest.fn().mockReturnThis(),
  addSelect: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  groupBy: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  offset: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  leftJoin: jest.fn().mockReturnThis(),
  getQuery: jest.fn().mockReturnValue('SQL_STRING'),
  getRawOne: jest.fn(),
  getRawMany: jest.fn(),
};

const mockDataSource = {
  createQueryBuilder: jest.fn(() => mockQueyBuilder),
};

describe('ProductionsService', () => {
  let service: ProductionsService;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductionsService,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<ProductionsService>(ProductionsService);
    dataSource = module.get<DataSource>(DataSource);

    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('GetOfTheDay', () => {
    it('should return the sum of local and producer production for the current day', async () => {
      mockQueyBuilder.getRawOne
        .mockResolvedValueOnce({ total: '100' })
        .mockResolvedValueOnce({ total: '50.5' });

      const result = await service.getOfTheDay();

      expect(result).toBe('150.50');
      expect(dataSource.createQueryBuilder).toHaveBeenCalledTimes(2);
    });

    it('should return "0.00" if there is no production data', async () => {
      mockQueyBuilder.getRawOne.mockResolvedValue({ total: null });

      const result = await service.getOfTheDay();

      expect(result).toBe('0.00');
    });

    it('should throw InternalServerErrorException on database error', async () => {
      mockQueyBuilder.getRawOne.mockRejectedValue(new Error('Erro de Conexão'));

      await expect(service.getOfTheDay()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
