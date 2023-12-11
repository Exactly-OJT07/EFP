import { PageOptionsDto } from 'src/common/dtos/pageOption';
import { StatusProjectEnum } from 'src/common/enum/enums';
import { EmployeeProject } from 'src/entities/employee_project.entity';

export class GetProjectParams extends PageOptionsDto {
  name: string;
  description: string;
  specification: string;
  langFrame: { name: string }[];
  technology: { name: string }[];
  status: StatusProjectEnum;
  startDate: Date;
  endDate: Date;
  employee_project: EmployeeProject[];
}
