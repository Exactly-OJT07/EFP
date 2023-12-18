import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './common/db/db.module';
import { AssignModule } from './modules/assign/assign.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { MailModule } from './modules/mail/mail.module';
import { ProjectModule } from './modules/project/project.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DbModule,
    MailModule,
    EmployeeModule,
    ProjectModule,
    AssignModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
