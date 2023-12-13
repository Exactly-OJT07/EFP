import { PageOptionsDto } from 'src/common/dtos/pageOption';
import { PositionEnum } from 'src/common/enum/enums';

export class GetAssignParams extends PageOptionsDto {
  roles: { name: PositionEnum }[];
  joinDate: Date;
  fireDate: Date;
  id: any;
}
