import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CostType } from '../enums/operational-cost.enum';

@Entity('operational-cost')
export class OperationalCost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: CostType })
  type: CostType;

  @Column({ type: 'date', nullable: false })
  date: Date;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: false })
  value: string;

  @Column({ type: 'text', nullable: true })
  description?: string;
}
