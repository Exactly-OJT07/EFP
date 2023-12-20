import { GenderEnum, PositionEnum, StatusEnum } from 'src/common/enum/enums';
export class UpdateEmployeeDto {
  name: string;

  email: string;

  phone: string;

  dateOfBirth: Date;

  position: PositionEnum;

  gender: GenderEnum;

  isManager: boolean;

  description: string;

  langFrame: { name: string; exp: number }[];

  tech: { name: string; exp: number }[];

  skills: { name: string; exp: number }[];

  identityCard: string;

  status: StatusEnum;

  avatar: string;

  joinDate: Date;

  fireDate: Date;

  managerId: number;

  address: string;
}
