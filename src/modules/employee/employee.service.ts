/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import path from 'path';
import PizZip from 'pizzip';
import { PageMetaDto } from 'src/common/dtos/pageMeta';
import { ResponsePaginate } from 'src/common/dtos/responsePaginate';
import {
  Order,
  PositionEnum,
  getFormattedPosition,
} from 'src/common/enum/enums';
import { Employee } from 'src/entities/employee.entity';
import { EmployeeProject } from 'src/entities/employee_project.entity';
import { Project } from 'src/entities/project.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { GetEmployeeParams } from './dto/getList_employee.dto';
import { GetManagers } from './dto/getManager.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import Docxtemplater from 'docxtemplater';

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

  async generateCv(id: string) {
    const { employee } = await this.getEmployeeById(id);
    function getFormattedRoles(roles: PositionEnum[]): string {
      return roles.map((role) => getFormattedPosition(role)).join(', ');
    }
    const dataDocx = {
      name: employee.name,
      address: employee.address,
      email: employee.email,
      date: `${new Date(employee.createdAt).getMonth() + 1}/${new Date(
        employee.createdAt,
      ).getFullYear()}`,
      position: getFormattedPosition(employee.position),
      lang_frame:
        employee.langFrame
          ?.map(function (item) {
            return (
              (item.name as unknown as string).charAt(0).toUpperCase() +
              (item.name as unknown as string).slice(1)
            );
          })
          .join(', ') ?? '',
      technical:
        employee.tech
          ?.map(function (item) {
            return (
              (item.name as unknown as string).charAt(0).toUpperCase() +
              (item.name as unknown as string).slice(1)
            );
          })
          .join(', ') ?? '',
      projects: employee.employee_project.map((item) => {
        return {
          project_name: item.project.name,
          role: getFormattedRoles(item.roles),
          description: item.project.description,
          specification: item.project.specification,
          lang_frame_project:
            item.project.langFrame
              .map((item) => item?.charAt(0).toUpperCase() + item?.slice(1))
              .join(', ') ?? '',
          tech_project:
            item.project.technology
              .map((item) => item?.charAt(0).toUpperCase() + item?.slice(1))
              .join(', ') ?? '',
        };
      }),
      skills: [
        ...employee.langFrame.map((item) => ({
          name: item.name,
          exp: item.exp,
        })),
        ...employee.tech.map((item) => ({
          name: item.name,
          exp: item.exp,
        })),
      ],
    };

    const content = fs.readFileSync(path.resolve('template2.docx'), 'binary');
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });
    doc.render(dataDocx);
    const buf = doc.getZip().generate({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    });
    return Buffer.from(buf).toString('hex');
  }
  async getEmployeeNoPaginate() {
    return await this.employeesRepository.find();
  }
  async create(createEmployeeDto: CreateEmployeeDto) {
    const existingEmployee = await this.employeesRepository.findOne({
      where: [
        { code: createEmployeeDto.code },
        { email: createEmployeeDto.email },
      ],
    });

    if (existingEmployee) {
      if (existingEmployee.code === createEmployeeDto.code) {
        throw new BadRequestException(
          `Employee with code ${createEmployeeDto.code} already exists.`,
        );
      } else if (existingEmployee.email === createEmployeeDto.email) {
        throw new BadRequestException(
          `Employee with email ${createEmployeeDto.email} already exists.`,
        );
      }
    }

    const employee = new Employee(createEmployeeDto);
    await this.entityManager.save(employee);
    return { employee, message: 'Successfully create employee' };
  }

  async getTotalEmployee(period: string) {
    const total = await this.employeesRepository.count();
    const pastYear = new Date();
    pastYear.setFullYear(pastYear.getFullYear() - 1);

    let oldCount, currentCount;
    if (period === 'year') {
      oldCount = await this.employeesRepository
        .createQueryBuilder('employee')
        .where('EXTRACT(YEAR FROM employee.createdAt) = :pastYear', {
          pastYear: pastYear.getFullYear(),
        })
        .getCount();

      currentCount = await this.employeesRepository
        .createQueryBuilder('employee')
        .where('EXTRACT(YEAR FROM employee.createdAt) = :currentYear', {
          currentYear: new Date().getFullYear(),
        })
        .getCount();
    } else if (period === 'month') {
      oldCount = await this.employeesRepository
        .createQueryBuilder('employee')
        .where('EXTRACT(YEAR FROM employee.createdAt) = :pastYear', {
          pastYear: new Date().getFullYear(),
        })
        .andWhere('EXTRACT(MONTH FROM employee.createdAt) = :pastMonth', {
          pastMonth: pastYear.getMonth(),
        })
        .getCount();

      currentCount = await this.employeesRepository
        .createQueryBuilder('project')
        .where('EXTRACT(YEAR FROM project.createdAt) = :currentYear', {
          currentYear: new Date().getFullYear(),
        })
        .andWhere('EXTRACT(MONTH FROM project.createdAt) = :currentMonth', {
          currentMonth: new Date().getMonth() + 1,
        })
        .getCount();
    } else if (period === 'count_join') {
      const currentYear = new Date().getFullYear();
      const joinCounts = {};

      for (let month = 0; month < 12; month++) {
        const formattedDate = `${currentYear}/${String(month + 1).padStart(
          2,
          '0',
        )}/01`;

        const count = await this.employeesRepository
          .createQueryBuilder('employee')
          .where('EXTRACT(YEAR FROM employee.joinDate) = :year', {
            year: currentYear,
          })
          .andWhere('EXTRACT(MONTH FROM employee.joinDate) = :month', {
            month: month + 1,
          })
          .getCount();

        joinCounts[formattedDate] = count;
      }
      return joinCounts;
    }

    const percentageChange =
      oldCount === 0 ? 100 : ((currentCount - oldCount) / oldCount) * 100;

    return { oldCount, currentCount, total, percentageChange };
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

  async getEmpoyeeDeleted(params: GetEmployeeParams) {
    const deletedEmployees = await this.employeesRepository
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
      .where('employee.deletedAt IS NOT NULL')
      .skip(params.skip)
      .take(params.take)
      .withDeleted()
      .orderBy('employee.createdAt', Order.DESC);

    if (params.searchByName) {
      deletedEmployees.andWhere('employee.name ILIKE :name', {
        name: `%${params.searchByName}%`,
      });
    }

    if (params.searchByEmail) {
      deletedEmployees.andWhere('employee.email ILIKE :email', {
        email: `%${params.searchByEmail}%`,
      });
    }

    const [result, total] = await deletedEmployees.getManyAndCount();
    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: params,
    });

    return new ResponsePaginate(result, pageMetaDto, 'Successfully');
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
    const managerProjects = await this.entityManager
      .getRepository(Project)
      .createQueryBuilder('project')
      .select([
        'project.id',
        'project.name',
        'project.startDate',
        'project.endDate',
      ])
      .where('project.managerId = :id', { id })
      .getMany();

    const managerTracking = managerProjects.map((project) => ({
      projectName: project.name,
      joinDate: project.startDate,
      doneDate: project.endDate,
      role: 'manager',
    }));

    const employeeProjects = await this.entityManager
      .getRepository(EmployeeProject)
      .createQueryBuilder('employee_project')
      .select([
        'employee_project.roles',
        'employee_project.joinDate',
        'employee_project.fireDate',
        'project.id',
        'project.name',
        'project.startDate',
        'project.endDate',
      ])
      .leftJoin('employee_project.project', 'project')
      .where('employee_project.employeeId = :id', { id })
      .withDeleted()
      .getMany();

    const otherRolesTracking = employeeProjects.map((employeeProject) => ({
      projectName: employeeProject.project.name,
      joinDate: employeeProject.joinDate,
      doneDate: employeeProject.fireDate || employeeProject.project.endDate,
      role: employeeProject.roles,
    }));
    const projects = [...managerTracking, ...otherRolesTracking];
    const employee = await this.employeesRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.employee_project', 'employee_project')
      .leftJoinAndSelect('employee_project.project', 'project')
      .where('employee.id = :id', { id })
      .getOne();

    if (employee) {
      const managerTracking = projects.filter(
        (item) => item.role === 'manager',
      );
      const otherRolesTracking = projects.filter(
        (item) => item.role !== 'manager',
      );

      employee.tracking = {
        joinDate: employee.joinDate,
        projects,
        fireDate: employee.deletedAt,
      };
    }
    return { employee, message: 'Successfully get data of employee' };
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    const employee = await this.employeesRepository.findOneBy({ id });
    if (employee) {
      employee.name = updateEmployeeDto.name;
      employee.email = updateEmployeeDto.email;
      employee.phone = updateEmployeeDto.phone;
      employee.address = updateEmployeeDto.address;
      employee.gender = updateEmployeeDto.gender;
      employee.identityCard = updateEmployeeDto.identityCard;
      employee.dateOfBirth = updateEmployeeDto.dateOfBirth;
      employee.position = updateEmployeeDto.position;
      employee.description = updateEmployeeDto.description;
      employee.status = updateEmployeeDto.status;
      employee.langFrame = updateEmployeeDto.langFrame;
      employee.tech = updateEmployeeDto.tech;
      employee.skills = updateEmployeeDto.skills;
      employee.avatar = updateEmployeeDto.avatar;
      employee.joinDate = updateEmployeeDto.joinDate;
      employee.managerId = updateEmployeeDto.managerId;
      employee.isManager = updateEmployeeDto.isManager;
      await this.entityManager.save(employee);
      return { employee, message: 'Successfully update employee' };
    }
  }

  async remove(id: string) {
    const employee = await this.employeesRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.employee_project', 'employee_project')
      .where('employee.id = :id', { id })
      .getOne();
    if (!employee) {
      return { message: 'Employee not found' };
    }
    const isManager = await this.employeesRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.project', 'project')
      .where('employee.id = :id', { id })
      .andWhere('project.managerId = :id', { id })
      .getCount();
    if (isManager > 0) {
      return {
        data: null,
        message: 'Employee is a manager of a project. Cannot delete.',
      };
    }
    if (employee.employee_project.length > 0) {
      for (const empProject of employee.employee_project) {
        await this.entityManager.remove(empProject);
      }
    }
    await this.employeesRepository.softDelete(id);
    return { data: null, message: 'Employee deletion successful' };
  }
}
