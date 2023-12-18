import { AbstractEntity } from 'src/common/entities/abstract.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EmployeeProject } from './employee_project.entity';
import { StatusProjectEnum } from 'src/common/enum/enums';
import { Employee } from './employee.entity';

@Entity()
export class Project extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  managerId: string;
  @ManyToOne(() => Employee, (employee) => employee.project)
  @JoinColumn({ name: 'managerId', referencedColumnName: 'id' })
  managerProject: Employee;

  @Column()
  description: string;

  @Column({ nullable: true })
  specification: string;

  @Column('json', { nullable: false })
  langFrame: string[];

  @Column('json', { nullable: false })
  technology: string[];

  @Column({
    type: 'enum',
    enum: StatusProjectEnum,
    default: StatusProjectEnum.PENDING,
  })
  status: StatusProjectEnum;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({ type: 'jsonb', nullable: true })
  tracking: any;

  @OneToMany(
    () => EmployeeProject,
    (employee_project) => employee_project.project,
  )
  employee_project: EmployeeProject[];

  constructor(project: Partial<Project>) {
    super();
    Object.assign(this, project);
  }
}
