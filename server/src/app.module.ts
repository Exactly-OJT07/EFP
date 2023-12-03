import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './common/db/db.module';
import { EmployeeModule } from './modules/employee/employee.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DbModule, EmployeeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
