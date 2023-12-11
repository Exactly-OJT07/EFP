import { PageOptionsDto } from 'src/common/dtos/pageOption';
import { GenderEnum, PositionEnum, StatusEnum } from 'src/common/enum/enums';

export class GetManagers extends PageOptionsDto {
  id: string;
  code: string;
  name: string;
  phone: string;
  dateOfBirth: Date;
  avatar: string;
  identityCard: string;
  gender: GenderEnum;
  status: StatusEnum;
  position: PositionEnum;
  skills: { name: string; exp: number }[];
  description: string;
  joinDate: Date;
  fireDate: Date;
  managerId: string;
}
