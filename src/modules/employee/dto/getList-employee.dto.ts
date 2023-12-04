import { PageOptionsDto } from 'src/common/dtos/pageOption';
import { GenderEnum, PositionEnum, StatusEnum } from 'src/common/enum/enums';

export class GetEmployeeParams extends PageOptionsDto {
  code: string;
  name: string;
  phone: string;
  dateOfBirth: Date;
  avatar: string;
  identityCard: string;
  gender: GenderEnum;
  status: StatusEnum;
  metadata: Record<string, unknown>;
  position: PositionEnum;
  isManager: boolean;
  description: string;
}
