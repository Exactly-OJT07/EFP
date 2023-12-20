import { PageOptionsDto } from 'src/common/dtos/pageOption';
import { GenderEnum, PositionEnum, StatusEnum } from 'src/common/enum/enums';
// import { Employee } from 'src/entities/employee.entity';
import { EmployeeProject } from 'src/entities/employee_project.entity';

export class GetEmployeeParams extends PageOptionsDto {
  code: string;
  name: string;
  phone: string;
  dateOfBirth: Date;
  avatar: string;
  identityCard: string;
  gender: GenderEnum;
  status: StatusEnum;
  position: PositionEnum;
  skills: { name: string; exp: number }[];
  langFrame: { name: string; exp: number }[];
  tech: { name: string; exp: number }[];
  isManager: boolean;
  description: string;
  joinDate: Date;
  fireDate: Date;
  employee_project: EmployeeProject[];
}
