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
import { PersonnelCostController } from './personnel-cost/personnel-cost.controller';

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
      entities: [User, LoginAttempt, PersonnelCost],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    PersonnelCostModule,
  ],
  controllers: [AppController, PersonnelCostController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
