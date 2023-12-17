import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID, IsEnum, IsDate } from 'class-validator';
import { PositionEnum } from 'src/common/enum/enums';

export class CreateAssignDto {
  @IsNotEmpty()
  @IsUUID()
  employeeId: string;

  @IsNotEmpty()
  @IsUUID()
  projectId: string;

  @Type(() => IsEnum)
  @IsNotEmpty()
  roles: PositionEnum[];

  @IsNotEmpty()
  @IsDate()
  joinDate: Date;
}
