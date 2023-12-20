import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { GetEmployeeParams } from './dto/getList_employee.dto';
import { ValidationPipe } from '@nestjs/common';
import { GetManagers } from './dto/getManager.dto';
import { Response } from 'express';
import { MailService } from '../mail/mail.service';

@Controller('employee')
export class EmployeeController {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly mailService: MailService,
  ) {}

  @Get('noPaginate')
  noPaginate() {
    return this.employeeService.getEmployeeNoPaginate();
  }

  @Post()
  async create(
    @Body(new ValidationPipe()) createEmployeeDto: CreateEmployeeDto,
  ) {
    const result = await this.employeeService.create(createEmployeeDto);

    await this.mailService.sendFaildCv(
      createEmployeeDto.email,
      createEmployeeDto.name,
    );

    return { result, message: 'Successfully create new employee' };
  }

  @Post('cv')
  async generateCv(@Body('id') id: string, @Res() res: Response) {
    try {
      const docxBuffer = await this.employeeService.generateCv(id);
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      );
      res.setHeader('Content-Disposition', 'attachment; filename=your_cv.docx');
      res.status(HttpStatus.OK).send(docxBuffer);
    } catch (error) {
      console.error('Error generating CV:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Error generating CV');
    }
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
    const result = await this.employeeService.remove(id);
    if (result.message) {
      return { message: result.message };
    } else {
      return { data: result.data, message: 'Success' };
    }
  }
}
