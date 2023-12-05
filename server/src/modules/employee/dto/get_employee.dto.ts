import { IsUUID } from 'class-validator';
export class GetEmployeeByIdParams {
  @IsUUID()
  id: string;
}
