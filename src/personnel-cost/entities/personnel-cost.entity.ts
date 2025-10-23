import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CostType } from '../enums/cost-type.enum';

@Entity('personnel-cost')
export class PersonnelCost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: CostType })
  type: CostType;

  @Column({ type: 'time without time zone', nullable: false })
  date: Date;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: false })
  value: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}
