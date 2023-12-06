import { GenderEnum, PositionEnum, StatusEnum } from 'src/common/enum/enums';
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
import { Project } from './project.entity';

@Entity()
export class Employee extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  email: string;

  @Column()
  code: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  identityCard: string;

  @Column({ nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  avatar: string;

  @Column({ type: 'enum', enum: GenderEnum, nullable: false })
  gender: GenderEnum;

  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
    nullable: false,
  })
  status: StatusEnum;

  @Column({
    type: 'enum',
    enum: PositionEnum,
    default: PositionEnum.FULLSTACK,
    nullable: false,
  })
  position: PositionEnum;

  @Column({ default: false })
  isManager: boolean;

  @Column('json', { nullable: true })
  skills: { name: string; exp: number }[];

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: false })
  joinDate: Date;

  @Column({ nullable: true })
  fireDate: Date;

  @ManyToOne(() => Employee, { nullable: true })
  @JoinColumn({ name: 'managerId' })
  manager: Employee;

  @Column({ nullable: true })
  managerId: number;

  @OneToMany(
    () => EmployeeProject,
    (employee_project) => employee_project.employee,
    { cascade: true, onUpdate: 'CASCADE' },
  )
  employee_project: EmployeeProject[];

  @OneToMany(() => Project, (project) => project.managerProject, {
    cascade: true,
    onUpdate: 'CASCADE',
  })
  project: Project[];

  constructor(employee: Partial<Employee>) {
    super();
    Object.assign(this, employee);
  }
}
