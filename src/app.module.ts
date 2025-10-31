import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { LoginAttempt } from './auth/login-attempts/login-attempt-entity';
import { PersonnelCostModule } from './personnel-cost/personnel-cost.module';
import { PersonnelCost } from './personnel-cost/entities/personnel-cost.entity';
import { UtilityCostModule } from './utility-cost/utility-cost.module';
import { UtilityCost } from './utility-cost/entities/utility-cost.entity';
import { SuppliesModule } from './supplies/supplies.module';
import { Supplies } from './supplies/entities/supplies.entity';
import { OperationalCostModule } from './operational-cost/operational-cost.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, LoginAttempt, PersonnelCost, UtilityCost, Supplies],
      synchronize: false,
    }),
    UsersModule,
    AuthModule,
    PersonnelCostModule,
    UtilityCostModule,
    SuppliesModule,
    OperationalCostModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
