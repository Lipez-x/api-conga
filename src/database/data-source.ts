import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from 'src/users/entities/user.entity';
import { LoginAttempt } from 'src/auth/login-attempts/login-attempt-entity';
import { PersonnelCost } from 'src/personnel-cost/entities/personnel-cost.entity';
import { UtilityCost } from 'src/utility-cost/entities/utility-cost.entity';
import { Supplies } from 'src/supplies/entities/supplies.entity';
import { OperationalCost } from 'src/operational-cost/entities/operational-cost.entity';
import { Expense } from 'src/expenses/entities/expense.entity';
import { LocalProduction } from 'src/production/entities/local-production.entity';
import { SalePrice } from 'src/sale-price/entities/sale-price-entity';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    User,
    LoginAttempt,
    PersonnelCost,
    UtilityCost,
    Supplies,
    OperationalCost,
    Expense,
    LocalProduction,
    SalePrice,
  ],
  migrations: ['src/database/migrations/*.ts'],
});
