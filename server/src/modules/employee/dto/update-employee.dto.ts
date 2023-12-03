import { GenderEnum, PositionEnum, StatusEnum } from 'src/common/enum/enums';
import { Employee } from 'src/entities/employee.entity';
import { EmployeeProject } from 'src/entities/employee_project.entity';

export class UpdateEmployeeDto {
    code: string;
    email: string;
    phone: string;
    dateOfBirth: Date;
    position: PositionEnum;
    isManager: boolean;
    description: string;
    langFrame: string;
    technology: string;
    status: StatusEnum;
    avatar: string;
    fireDate: Date;
}
