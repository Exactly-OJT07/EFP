import { IsNotEmpty, IsUUID, IsEnum, IsDate } from 'class-validator';
import { PositionEnum } from 'src/common/enum/enums';

export class CreateAssignDto {
  @IsNotEmpty()
  @IsUUID()
  employeeId: string;

  @IsNotEmpty()
  @IsUUID()
  projectId: string;

  @IsNotEmpty()
  @IsEnum(PositionEnum)
  role: PositionEnum;

  @IsNotEmpty()
  @IsDate()
  joinDate: Date;

  @IsDate()
  fireDate: Date;
}
