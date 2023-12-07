import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { GetEmployeeParams } from './dto/getList_employee.dto';
import { ValidationPipe } from '@nestjs/common';

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

  @Get()
  findAll(@Query() params: GetEmployeeParams) {
    return this.employeeService.getEmployees(params);
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
