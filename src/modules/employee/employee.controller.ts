import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { GetEmployeeParams } from './dto/getList_employee.dto';
import { GetManagers } from './dto/getManager.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeService } from './employee.service';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  async create(
    @Body(new ValidationPipe()) createEmployeeDto: CreateEmployeeDto,
  ) {
    const result = await this.employeeService.create(createEmployeeDto);
    return { result, message: 'Successfully create new employee' };
  }

  @Post('cv')
  generateCv(@Body('id') id: string) {
    return this.employeeService.generateCv(id);
  }

  @Get('total')
  getTotalEmployee(@Query('period') period: string) {
    return this.employeeService.getTotalEmployee(period);
  }

  @Get()
  findAll(@Query() params: GetEmployeeParams) {
    return this.employeeService.getEmployees(params);
  }
  @Get('deleted')
  async getEmpoyeeDeleted(@Query() params: GetEmployeeParams) {
    return this.employeeService.getEmpoyeeDeleted(params);
  }
  @Get('managers')
  async getManagers(@Query() params: GetManagers) {
    return this.employeeService.getManagers(params);
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.employeeService.getEmployeeById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateEmployeeDto: UpdateEmployeeDto,
  ) {
    const result = await this.employeeService.update(id, updateEmployeeDto);
    return { result, message: 'Successfully update employee' };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.employeeService.remove(id);
  }
}
