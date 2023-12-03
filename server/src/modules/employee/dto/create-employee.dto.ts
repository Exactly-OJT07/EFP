import { GenderEnum, PositionEnum, StatusEnum } from 'src/common/enum/enums';
import { Employee } from 'src/entities/employee.entity';
import { EmployeeProject } from 'src/entities/employee_project.entity';

export class CreateEmployeeDto {
    name: string;
    code: string;
    email: string;
    gender: GenderEnum;
    phone: string;
    dateOfBirth: Date;
    identityCard: string;
    position: PositionEnum;
    isManager: boolean;
    description: string;
    langFrame: string;
    technology: string;
    status: StatusEnum;
    avatar: string;
    joinDate: Date;
    manager: Employee;
    managerId : number;
    employee_project: EmployeeProject[];
}
