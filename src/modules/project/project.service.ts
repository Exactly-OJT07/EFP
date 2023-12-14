import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { EntityManager, Repository } from 'typeorm';
import { Project } from '../../entities/project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GetProjectParams } from './dto/getList-project.dto';
import { Order, StatusProjectEnum } from 'src/common/enum/enums';
import { PageMetaDto } from 'src/common/dtos/pageMeta';
import { ResponsePaginate } from 'src/common/dtos/responsePaginate';
import { Employee } from 'src/entities/employee.entity';
import { EmployeeProject } from 'src/entities/employee_project.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRespository: Repository<Project>,
    @InjectRepository(Employee)
    private employeeRespository: Repository<Employee>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    const project = new Project(createProjectDto);
    await this.entityManager.save(project);
    return { project, message: 'Successfully create projects' };
  }

  async getTotalProject(period: string) {
    const total = await this.projectRespository.count();
    const pastYear = new Date();
    pastYear.setFullYear(pastYear.getFullYear() - 1);

    let oldCount, currentCount;
    if (period === 'year') {
      oldCount = await this.projectRespository
        .createQueryBuilder('project')
        .where('EXTRACT(YEAR FROM project.createdAt) = :pastYear', {
          pastYear: pastYear.getFullYear(),
        })
        .getCount();

      currentCount = await this.projectRespository
        .createQueryBuilder('project')
        .where('EXTRACT(YEAR FROM project.createdAt) = :currentYear', {
          currentYear: new Date().getFullYear(),
        })
        .getCount();
    } else if (period === 'month') {
      oldCount = await this.projectRespository
        .createQueryBuilder('project')
        .where('EXTRACT(YEAR FROM project.createdAt) = :pastYear', {
          pastYear: pastYear.getFullYear(),
        })
        .andWhere('EXTRACT(MONTH FROM project.createdAt) = :pastMonth', {
          pastMonth: pastYear.getMonth() + 1,
        })
        .getCount();

      currentCount = await this.projectRespository
        .createQueryBuilder('project')
        .where('EXTRACT(YEAR FROM project.createdAt) = :currentYear', {
          currentYear: new Date().getFullYear(),
        })
        .andWhere('EXTRACT(MONTH FROM project.createdAt) = :currentMonth', {
          currentMonth: new Date().getMonth() + 1,
        })
        .getCount();
    }

    const percentageChange =
      oldCount === 0 ? 100 : ((currentCount - oldCount) / oldCount) * 100;

    return { oldCount, currentCount, total, percentageChange };
  }

  async getProjects(params: GetProjectParams) {
    const projects = this.projectRespository
      .createQueryBuilder('project')
      .select([
        'project',
        'manager.code',
        'manager.name',
        'manager.avatar',
        'manager.email',
        'employee_project',
        'employee_project.roles',
        'employee_project.joinDate',
        'employee_project.fireDate',
        'employee_project.employeeId',
        'employee.name',
        'employee.email',
        'employee.code',
        'employee.avatar',
      ])
      .leftJoin('project.managerProject', 'manager')
      .leftJoin('project.employee_project', 'employee_project')
      .leftJoin('employee_project.employee', 'employee')
      .andWhere('project.status = ANY(:status)', {
        status: params.status
          ? [params.status]
          : [
              StatusProjectEnum.DONE,
              StatusProjectEnum.ON_PROGRESS,
              StatusProjectEnum.PENDING,
              StatusProjectEnum.CLOSED,
            ],
      })
      .skip(params.skip)
      .take(params.take)
      .orderBy('project.createdAt', Order.DESC);

    if (params.search) {
      projects.andWhere('project.name ILIKE :name', {
        name: `%${params.search}%`,
      });
    }
    const [result, total] = await projects.getManyAndCount();
    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: params,
    });
    return new ResponsePaginate(result, pageMetaDto, 'Successfully');
  }

  async getProjectDeleted(params: GetProjectParams) {
    const projects = this.projectRespository
      .createQueryBuilder('project')
      .select([
        'project',
        'manager.code',
        'manager.name',
        'manager.avatar',
        'manager.email',
        'employee_project',
        'employee_project.roles',
        'employee_project.joinDate',
        'employee_project.fireDate',
        'employee_project.employeeId',
        'employee.name',
        'employee.email',
        'employee.code',
        'employee.avatar',
      ])
      .leftJoin('project.managerProject', 'manager')
      .leftJoin('project.employee_project', 'employee_project')
      .leftJoin('employee_project.employee', 'employee')
      .andWhere('project.status = ANY(:status)', {
        status: params.status
          ? [params.status]
          : [
              StatusProjectEnum.DONE,
              StatusProjectEnum.ON_PROGRESS,
              StatusProjectEnum.PENDING,
              StatusProjectEnum.CLOSED,
            ],
      })
      .where('project.deletedAt IS NOT NULL')
      .skip(params.skip)
      .take(params.take)
      .withDeleted()
      .orderBy('project.createdAt', Order.DESC);

    if (params.search) {
      projects.andWhere('project.name ILIKE :name', {
        name: `%${params.search}%`,
      });
    }
    const [result, total] = await projects.getManyAndCount();
    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: params,
    });
    return new ResponsePaginate(result, pageMetaDto, 'Successfully');
  }

  async getProjectById(id: string) {
    const project = await this.projectRespository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.managerProject', 'manager')
      .leftJoinAndSelect('project.employee_project', 'employee_project')
      .leftJoinAndSelect('employee_project.employee', 'employee')
      .where('project.id = :id', { id })
      .getOne();

    if (project) {
      const projectEmployeesWithDeletedAt = await this.entityManager
        .getRepository(EmployeeProject)
        .createQueryBuilder('employee_project')
        .leftJoinAndSelect('employee_project.employee', 'employee')
        .leftJoinAndSelect('employee_project.project', 'project')
        .where('project.id = :id', { id })
        .withDeleted()
        .getMany();

      const tracking = projectEmployeesWithDeletedAt.map(
        (projectEmployee: EmployeeProject) => ({
          employeeName: projectEmployee.employee?.name,
          roles: projectEmployee.roles,
          joinDate: projectEmployee.joinDate,
          doneDate: projectEmployee.deletedAt,
        }),
      );

      project.tracking = {
        joinDate: project.startDate,
        member: tracking,
        fireDate: project.endDate,
      };
    }
    return project;
  }

  async getUnassignedEmployeesInProject(id: string) {
    const project = await this.projectRespository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.employee_project', 'employee_project')
      .leftJoinAndSelect('employee_project.employee', 'employee')
      .where('project.id = :id', { id })
      .getOne();

    if (!project) {
      throw new NotFoundException('Project not found');
    }
    const allEmployees = await this.employeeRespository.find();
    const unassignedEmployees = allEmployees.filter((employee) => {
      return !project.employee_project.some(
        (assignedEmployee) => assignedEmployee.employeeId === employee.id,
      );
    });
    return unassignedEmployees;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const project = await this.projectRespository.findOneBy({ id });
    project.name = updateProjectDto.name;
    project.managerId = updateProjectDto.managerId;
    project.description = updateProjectDto.description;
    project.specification = updateProjectDto.specification;
    project.status = updateProjectDto.status;
    project.langFrame = updateProjectDto.langFrame;
    project.technology = updateProjectDto.technology;
    project.startDate = updateProjectDto.startDate;
    project.endDate = updateProjectDto.endDate;
    await this.entityManager.save(project);
    return { project, message: 'Successfully update project' };
  }

  async remove(id: string) {
    await this.projectRespository.softDelete(id);
    return { message: 'Project deletion successful' };
  }
}
