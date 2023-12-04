import { IsNotEmpty } from 'class-validator';
import { PositionEnum, StatusEnum } from 'src/common/enum/enums';
export class UpdateEmployeeDto {
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
  isManager: boolean;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  langFrame: string;

  @IsNotEmpty()
  technology: string;

  @IsNotEmpty()
  status: StatusEnum;

  @IsNotEmpty()
  avatar: string;

  fireDate: Date;
}
