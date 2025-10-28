import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CostType } from '../enums/cost-type.enum';

@Entity('utility_cost')
export class UtilityCost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: CostType })
  type: CostType;

  @Column({ type: 'date', nullable: false })
  date: Date;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: false })
  value: string;

  @Column({ type: 'text' })
  observations: string;
}
