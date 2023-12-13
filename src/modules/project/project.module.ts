import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { Project } from 'src/entities/project.entity';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from 'src/entities/employee.entity';
import { EmployeeProject } from 'src/entities/employee_project.entity';
import { EmployeeController } from '../employee/employee.controller';
import { EmployeeService } from '../employee/employee.service';
import { AssignController } from '../assign/assign.controller';
import { AssignService } from '../assign/assign.service';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Employee, EmployeeProject])],
  controllers: [ProjectController, EmployeeController, AssignController],
  providers: [ProjectService, EmployeeService, AssignService],
})
export class ProjectModule {}
