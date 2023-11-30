import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { GenderEnum, PositionEnum, StatusEnum } from 'src/common/enum/enums';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EmployeeProject } from './employee_project';

@Entity()
export class Employee extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  avatar: string;

  @Column()
  identityCard: string;

  @Column({ type: 'enum', enum: GenderEnum, nullable: true })
  gender: GenderEnum;

  @Column({ type: 'enum', enum: StatusEnum, default: StatusEnum.ACTIVE })
  status: StatusEnum;

  @Column('json', { nullable: true })
  metadata: Record<string, unknown>;

  @Column({ type: 'enum', enum: PositionEnum, default: PositionEnum.FULLSTACK })
  position: PositionEnum;

  @Column({ default: false })
  isManager: boolean;

  @Column({ nullable: true })
  description: string;

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
}
