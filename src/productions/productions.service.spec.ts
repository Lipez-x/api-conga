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

  describe('getDaily', () => {
    it('should return paginated daily production data', async () => {
      const filters = { page: 1, limit: 10 };
      const mockData = [
        { date: '2023-01-01', total: 100 },
        { date: '2023-01-02', total: 200 },
      ];

      mockQueyBuilder.getRawMany
        .mockResolvedValueOnce(mockData)
        .mockResolvedValueOnce(mockData);

      const result = await service.getDaily(filters);

      expect(result).toEqual({
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
        data: mockData,
      });

      expect(mockQueyBuilder.offset).toHaveBeenCalledWith(0);
      expect(mockQueyBuilder.limit).toHaveBeenCalledWith(10);
    });

    it('should throw InternalServerErrorException on database error', async () => {
      const filters = { page: 1, limit: 10 };

      mockQueyBuilder.getRawMany.mockRejectedValue(new Error('DB Error'));

      await expect(service.getDaily(filters)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('getGroupedByMonth', () => {
    it('should return production data grouped by month', async () => {
      const mockResult = [
        {
          month: '2025-11',
          localTotal: '100',
          producerTotal: '50',
          total: '150',
        },
        {
          month: '2025-12',
          localTotal: '200',
          producerTotal: '100',
          total: '300',
        },
      ];

      mockQueyBuilder.getRawMany.mockResolvedValue(mockResult);

      const result = await service.getGroupedByMonth();

      expect(result).toEqual(mockResult);
      expect(mockQueyBuilder.orderBy).toHaveBeenCalledWith('m.month', 'DESC');
    });

    it('should throw InternalServerErrorException on database error', async () => {
      mockQueyBuilder.getRawMany.mockRejectedValue(new Error('SQL Error'));

      await expect(service.getGroupedByMonth()).rejects.toThrow(InternalServerErrorException);
    });
  });
});
