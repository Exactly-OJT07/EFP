import { PageOptionsDto } from 'src/common/dtos/pageOption';

export class GetAssignParams extends PageOptionsDto {
  role: string;
  joinDate: Date;
  fireDate: Date;
  id: any;
}
