import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from 'src/entities/employee.entity';
import { Project } from 'src/entities/project.entity';
import { EmployeeProject } from 'src/entities/employee_project.entity';
import { EmployeeService } from './employee.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee]),
    TypeOrmModule.forFeature([Project]),
    TypeOrmModule.forFeature([EmployeeProject]),
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule {
  static forFeature(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    arg0: (typeof import('../../entities/project.entity').Project)[],
  ):
    | import('@nestjs/common').Type<any>
    | import('@nestjs/common').DynamicModule
    | Promise<import('@nestjs/common').DynamicModule>
    | import('@nestjs/common').ForwardReference<any> {
    throw new Error('Method not implemented.');
  }
}
