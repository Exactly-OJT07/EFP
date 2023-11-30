import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { StatusEnum } from 'src/common/enum/enums';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EmployeeProject } from './employee_project';

@Entity()
export class Project extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  manager: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  langFrame: string;

  @Column()
  technology: string;

  @Column({ type: 'enum', enum: StatusEnum, default: StatusEnum.ACTIVE })
  status: StatusEnum;

  @Column({ nullable: true })
  specification: string;

  @OneToMany(
    () => EmployeeProject,
    (employee_project) => employee_project.project,
  )
  employee_project: EmployeeProject[];
}