import { LocalProduction } from 'src/productions/local/entities/local-production.entity';
import { ProducerProduction } from 'src/productions/producer/entities/producer-production.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('receives')
export class Receive {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date', nullable: false, unique: true })
  date: Date;

  @OneToMany(() => LocalProduction, (lp) => lp.receive)
  localProductions: LocalProduction[];

  @OneToMany(() => ProducerProduction, (pp) => pp.receive)
  producerProductions: ProducerProduction[];

  @Column({ name: 'sale_price', type: 'decimal', precision: 12, scale: 2 })
  salePrice: number;

  @Column({ name: 'tank_quantity', type: 'decimal', precision: 12, scale: 2 })
  tankQuantity: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalPrice: number;

  @BeforeInsert()
  @BeforeUpdate()
  calculateTotalPrice() {
    this.totalPrice = this.tankQuantity * Number(this.salePrice);
  }
}
