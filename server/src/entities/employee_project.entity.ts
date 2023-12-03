import { AbstractEntity } from 'src/common/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Employee } from './employee.entity';
import { Project } from './project.entity';

@Entity()
export class EmployeeProject extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  role: string;

  @Column()
  joinDate: Date;

  @Column()
  fireDate: Date;

  @ManyToOne(() => Project, (project) => project.employee_project, {
    cascade: true,
  })
  project: Project;

  @ManyToOne(() => Employee, (employee) => employee.employee_project)
  @JoinColumn({ name: 'employeeId', referencedColumnName: 'id' })
  employee: Employee;
}