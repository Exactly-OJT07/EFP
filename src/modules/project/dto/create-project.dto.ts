import { IsNotEmpty, IsDate } from 'class-validator';
import { StatusProjectEnum } from 'src/common/enum/enums';

export class CreateProjectDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  managerId: string;

  @IsNotEmpty()
  description: string;

  specification: string;
  status: StatusProjectEnum;

  langFrame: { name: string }[];
  technology: { name: string }[];

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;
}
