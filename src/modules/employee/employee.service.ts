import { Injectable } from '@nestjs/common';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EntityManager, Repository } from 'typeorm';
import { Employee } from 'src/entities/employee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PageMetaDto } from 'src/common/dtos/pageMeta';
import { ResponsePaginate } from 'src/common/dtos/responsePaginate';
import { GetEmployeeParams } from './dto/getList_employee.dto';
import { Order } from 'src/common/enum/enums';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { Project } from 'src/entities/project.entity';
import { EmployeeProject } from 'src/entities/employee_project.entity';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeesRepository: Repository<Employee>,
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
    @InjectRepository(Project)
    private readonly assignsRepository: Repository<EmployeeProject>,
    private readonly entityManager: EntityManager,
  ) {}
  async create(createEmployeeDto: CreateEmployeeDto) {
    const employee = new Employee(createEmployeeDto);
    await this.entityManager.save(employee);
    return employee;
  }

  async getEmployees(params: GetEmployeeParams) {
    const employees = this.employeesRepository
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

  async findOne(id: string) {
    return this.employeesRepository.findOneBy({ id });
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    const employee = await this.employeesRepository.findOneBy({ id });
    if (employee) {
      employee.email = updateEmployeeDto.email;
      employee.code = updateEmployeeDto.code;
      employee.phone = updateEmployeeDto.phone;
      employee.position = updateEmployeeDto.position;
      employee.description = updateEmployeeDto.description;
      employee.status = updateEmployeeDto.status;
      employee.technology = updateEmployeeDto.technology;
      employee.langFrame = updateEmployeeDto.langFrame;
      employee.avatar = updateEmployeeDto.avatar;
      employee.fireDate = updateEmployeeDto.fireDate;
      await this.entityManager.save(employee);
      return employee;
    }
  }
  async remove(id: string) {
    return this.employeesRepository.softDelete(id);
  }
}
