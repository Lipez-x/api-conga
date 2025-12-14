import { Expose, Transform } from 'class-transformer';

export class ReceivesResponseDto {
  @Expose()
  id: string;

  @Expose()
  date: string;

  @Transform(({ value }) => Number(value) || 0)
  @Expose()
  salePrice: number;

  @Transform(({ value }) => Number(value) || 0)
  @Expose()
  tankQuantity: number;

  @Transform(({ value }) => Number(value) || 0)
  @Expose()
  totalPrice: number;
}
