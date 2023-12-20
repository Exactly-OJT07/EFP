import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';

interface EmployeeRolesUpdate {
  [employeeId: string]: string[];
}
export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  employeeRoles: EmployeeRolesUpdate;
}
