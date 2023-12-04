import { PageOptionsDto } from 'src/common/dtos/pageOption';
import { StatusProjectEnum } from 'src/common/enum/enums';

export class GetProjectParams extends PageOptionsDto {
  name: string;
  manager: string;
  description: string;
  specification: Date;
  langFrame: string;
  technology: string;
  status: StatusProjectEnum;
  startDate: Date;
  endDate: Date;
}
