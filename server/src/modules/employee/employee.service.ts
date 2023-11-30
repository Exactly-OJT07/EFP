/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PageMetaDto } from 'src/common/dtos/pageMeta';
import { ResponsePaginate } from 'src/common/dtos/responsePaginate';
import { Order } from 'src/common/enum/enums';
import { Employee } from 'src/entities/employee.entity';
import { Repository } from 'typeorm';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { GetEmployeeParams } from './dto/getList-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}
  create(_createEmployeeDto: CreateEmployeeDto) {
    return 'This action adds a new employee';
  }

  async getEmployees(params: GetEmployeeParams) {
    const employees = this.employeeRepository
      .createQueryBuilder('employee')
      .skip(params.skip)
      .take(params.take)
      .orderBy('employee.createdAt', Order.DESC);

    if (params.name) {
      employees.andWhere('employee.name ILIKE :name', {
        name: `%${params.name}%`,
      });
    }

    const [result, total] = await employees.getManyAndCount();

    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: params,
    });

    return new ResponsePaginate(result, pageMetaDto, 'Success');
  }

  findOne(id: number) {
    return `This action returns a #${id} employee`;
  }

  update(id: number, _updateEmployeeDto: UpdateEmployeeDto) {
    return `This action updates a #${id} employee`;
  }

  remove(id: number) {
    return `This action removes a #${id} employee`;
  }
}
