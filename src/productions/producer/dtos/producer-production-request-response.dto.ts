import { Expose, Transform } from 'class-transformer';

export class ProducerProductionRequestResponseDto {
  @Expose()
  id: string;

  @Expose()
  date: string;

  @Expose()
  producerName: string;

  @Transform(({ value }) => Number(value) || 0)
  @Expose()
  totalQuantity: number;

  @Expose()
  status: string;

  @Expose()
  validatedAt: string;
}
