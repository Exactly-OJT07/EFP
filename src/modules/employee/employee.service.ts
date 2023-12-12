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
import { GetManagers } from './dto/getManager.dto';

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
    return { employee, message: 'Successfully create employee' };
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
    if (params.searchByName) {
      employees.andWhere('employee.name ILIKE :name', {
        name: `%${params.searchByName}%`,
      });
    }
    if (params.searchByEmail) {
      employees.andWhere('employee.email ILIKE :email', {
        email: `%${params.searchByEmail}%`,
      });
    }
    const [result, total] = await employees.getManyAndCount();
    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: params,
    });
    return new ResponsePaginate(result, pageMetaDto, 'Successfully ');
  }

  async getManagers(params: GetManagers) {
    try {
      const managers = await this.employeesRepository
        .createQueryBuilder('employee')
        .where('employee.isManager = :isManager', { isManager: true })
        .skip(params.skip)
        .take(params.take)
        .getMany();
      return managers;
    } catch (error) {
      console.error('Error in getManagers:', error);
      throw error;
    }
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

    if (employee) {
      const employeeProjectsWithDeletedAt = await this.entityManager
        .getRepository(EmployeeProject)
        .createQueryBuilder('employee_project')
        .leftJoin('employee_project.employee', 'employee')
        .leftJoinAndSelect('employee_project.project', 'project')
        .where('employee.id = :id', { id })
        .withDeleted()
        .getMany();

      const tracking = employeeProjectsWithDeletedAt.map(
        (employeeProject: EmployeeProject) => ({
          projectName: employeeProject.project.name,
          projectStartDate: employeeProject.project.startDate,
          joinDate: employeeProject.joinDate,
          doneDate: employeeProject.deletedAt,
          projectEndDate: employeeProject.project.endDate,
        }),
      );

      employee.tracking = {
        joinDate: employee.joinDate,
        projects: tracking,
        fireDate: employee.fireDate,
      };
    }
    return employee;
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    const employee = await this.employeesRepository.findOneBy({ id });
    if (employee) {
      employee.name = updateEmployeeDto.name;
      employee.email = updateEmployeeDto.email;
      employee.phone = updateEmployeeDto.phone;
      employee.gender = updateEmployeeDto.gender;
      employee.position = updateEmployeeDto.position;
      employee.description = updateEmployeeDto.description;
      employee.status = updateEmployeeDto.status;
      employee.skills = updateEmployeeDto.skills;
      employee.avatar = updateEmployeeDto.avatar;
      employee.joinDate = updateEmployeeDto.joinDate;
      employee.fireDate = updateEmployeeDto.fireDate;
      employee.managerId = updateEmployeeDto.managerId;
      await this.entityManager.save(employee);
      return { employee, message: 'Successfully update employee' };
    }
  }
  async remove(id: string) {
    await this.employeesRepository.softDelete(id);
    return { message: 'Employee deletion successful' };
  }
}
