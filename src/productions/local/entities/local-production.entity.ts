import { Receive } from 'src/receives/entities/receive.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('local_production')
export class LocalProduction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @ManyToOne(() => Receive, (receive) => receive.localProductions)
  @JoinColumn({ name: 'date', referencedColumnName: 'date' })
  date: Date;

  @Column({
    name: 'gross_quantity',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  grossQuantity: number;

  @Column({
    name: 'consumed_quantity',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  consumedQuantity: number;

  @Column({
    name: 'total_quantity',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  totalQuantity: number;

  @BeforeInsert()
  @BeforeUpdate()
  calculateTotalQuantity() {
    this.totalQuantity =
      Number(this.grossQuantity) - Number(this.consumedQuantity);
  }
}
