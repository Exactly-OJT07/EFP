import { Module } from '@nestjs/common';
import { AssignService } from './assign.service';
import { AssignController } from './assign.controller';
import { EmployeeProject } from 'src/entities/employee_project.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/entities/project.entity';
import { Employee } from 'src/entities/employee.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmployeeProject]),
    TypeOrmModule.forFeature([Project]),
    TypeOrmModule.forFeature([Employee]),
  ],
  controllers: [AssignController],
  providers: [AssignService],
})
export class AssignModule {}
