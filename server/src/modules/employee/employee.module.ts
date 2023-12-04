import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from 'src/entities/employee.entity';
import { Project } from 'src/entities/project.entity';
import { EmployeeProject } from 'src/entities/employee_project.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee]),
    TypeOrmModule.forFeature([Project]),
    TypeOrmModule.forFeature([EmployeeProject]),
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule {}
