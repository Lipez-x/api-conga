import { LocalProduction } from 'src/productions/local/entities/local-production.entity';
import { ProducerProduction } from 'src/productions/producer/entities/producer-production.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

@Entity('receives')
export class Receive {
  @PrimaryColumn('date')
  date: Date;

  @OneToMany(() => LocalProduction, (lp) => lp.date)
  localProductions: LocalProduction[];

  @OneToMany(() => ProducerProduction, (pp) => pp.date)
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
