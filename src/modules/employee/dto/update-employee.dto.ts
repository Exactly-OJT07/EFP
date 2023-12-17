import { IsNotEmpty } from 'class-validator';
import { GenderEnum, PositionEnum, StatusEnum } from 'src/common/enum/enums';
export class UpdateEmployeeDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  dateOfBirth: Date;

  @IsNotEmpty()
  position: PositionEnum;

  @IsNotEmpty()
  gender: GenderEnum;

  @IsNotEmpty()
  isManager: boolean;

  @IsNotEmpty()
  description: string;

  skills: { name: string; exp: number }[];

  @IsNotEmpty()
  status: StatusEnum;

  @IsNotEmpty()
  avatar: string;

  joinDate: Date;

  fireDate: Date;

  managerId: number;
}
