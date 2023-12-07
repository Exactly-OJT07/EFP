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
      .select([
        'employee',
        'manager.name',
        'manager.code',
        'manager.email',
        'manager.phone',
      ])
      .leftJoin('employee.manager', 'manager')
      .leftJoinAndSelect('employee.employee_project', 'employee_project')
      .leftJoinAndSelect('employee_project.project', 'project')
      .skip(params.skip)
      .take(params.take)
      .orderBy('employee.createdAt', Order.DESC);
    if (params.search) {
      employees.andWhere('project.name ILIKE :name', {
        name: `%${params.search}%`,
      });
    }
    const [result, total] = await employees.getManyAndCount();
    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: params,
    });
    return new ResponsePaginate(result, pageMetaDto, 'Success');
  }

  async getEmployeeById(id: string) {
    const employee = await this.employeesRepository
      .createQueryBuilder('employee')
      .select([
        'employee',
        'manager.name',
        'manager.code',
        'manager.email',
        'manager.phone',
      ])
      .leftJoin('employee.manager', 'manager')
      .leftJoinAndSelect('employee.employee_project', 'employee_project')
      .leftJoinAndSelect('employee_project.project', 'project')
      .where('employee.id = :id', { id })
      .getOne();
    return employee;
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
