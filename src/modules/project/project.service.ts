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
    @InjectRepository(EmployeeProject)
    private assignRespository: Repository<EmployeeProject>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    const { employee_project, ...projectData } = createProjectDto;

    const project = new Project(projectData);
    await this.entityManager.save(Project, project);

    if (employee_project && employee_project.length > 0) {
      const employeeProjects = employee_project.map((employeeData) => {
        const { employeeId, roles } = employeeData;
        const employeeProject = new EmployeeProject({
          employeeId,
          roles,
          joinDate: new Date(),
          fireDate: null,
          project,
        });

        return employeeProject;
      });

      await this.entityManager.save(EmployeeProject, employeeProjects);
    }

    return {
      project,
      message: 'Successfully created a project with assigned employees',
    };
  }

  async getTotalProject(period: string) {
    const total = await this.projectRespository.count();
    const pastYear = new Date();
    pastYear.setFullYear(pastYear.getFullYear() - 1);

    let oldCount, currentCount, oldDoneCount, currentDoneCount;
    const pendingCount = await this.projectRespository
      .createQueryBuilder('project')
      .where('project.status = :status', { status: 'pending' })
      .getCount();

    const onProgressCount = await this.projectRespository
      .createQueryBuilder('project')
      .where('project.status = :status', { status: 'on_progress' })
      .getCount();

    const doneCount = await this.projectRespository
      .createQueryBuilder('project')
      .where('project.status = :status', { status: 'done' })
      .getCount();

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

      oldDoneCount = await this.projectRespository
        .createQueryBuilder('project')
        .where('project.status = :status', { status: 'done' })
        .andWhere('EXTRACT(YEAR FROM project.endDate) = :oldYear', {
          oldYear: pastYear.getFullYear(),
        })
        .getCount();

      currentDoneCount = await this.projectRespository
        .createQueryBuilder('project')
        .where('project.status = :status', { status: 'done' })
        .andWhere('EXTRACT(YEAR FROM project.endDate) = :currentYear', {
          currentYear: new Date().getFullYear(),
        })
        .getCount();
    } else if (period === 'month') {
      oldCount = await this.projectRespository
        .createQueryBuilder('project')
        .where('EXTRACT(YEAR FROM project.createdAt) = :pastYear', {
          pastYear: new Date().getFullYear(),
        })
        .andWhere('EXTRACT(MONTH FROM project.createdAt) = :pastMonth', {
          pastMonth: pastYear.getMonth(),
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

      oldDoneCount = await this.projectRespository
        .createQueryBuilder('project')
        .where('project.status = :status', { status: 'done' })
        .andWhere('EXTRACT(YEAR FROM project.endDate) = :pastYear', {
          pastYear: new Date().getFullYear(),
        })
        .andWhere('EXTRACT(MONTH FROM project.endDate) = :pastMonth', {
          pastMonth: pastYear.getMonth(),
        })
        .getCount();

      currentDoneCount = await this.projectRespository
        .createQueryBuilder('project')
        .where('project.status = :status', { status: 'done' })
        .andWhere('EXTRACT(YEAR FROM project.endDate) = :currentYear', {
          currentYear: new Date().getFullYear(),
        })
        .andWhere('EXTRACT(MONTH FROM project.endDate) = :currentMonth', {
          currentMonth: new Date().getMonth() + 1,
        })
        .getCount();
    } else if (period === 'count_join') {
      const currentYear = new Date().getFullYear();
      const joinCounts = {};

      for (let month = 0; month < 12; month++) {
        const count = await this.projectRespository
          .createQueryBuilder('project')
          .where('EXTRACT(YEAR FROM project.startDate) = :year', {
            year: currentYear,
          })
          .andWhere('EXTRACT(MONTH FROM project.startDate) = :month', {
            month: month + 1,
          })
          .getCount();

        joinCounts[month + 1] = count;
      }
      return joinCounts;
    }

    const percentageProjectChange =
      oldCount === 0 ? 100 : ((currentCount - oldCount) / oldCount) * 100;

    const percentageDoneChange =
      oldDoneCount === 0
        ? 100
        : ((currentDoneCount - oldDoneCount) / oldDoneCount) * 100;

    const pendingPercentage = (pendingCount / total) * 100;
    const onProgressPercentage = (onProgressCount / total) * 100;
    const donePercentage = (doneCount / total) * 100;

    return {
      total,
      oldCount,
      currentCount,
      percentageProjectChange,
      oldDoneCount,
      currentDoneCount,
      percentageDoneChange,
      pendingPercentage,
      onProgressPercentage,
      donePercentage,
    };
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
          id: projectEmployee.employee.id,
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
    return {
      project,
      message: 'Successfully get project',
    };
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
      return (
        !project.employee_project.some(
          (assignedEmployee) => assignedEmployee.employeeId === employee.id,
        ) && employee.status === 'active'
      );
    });
    return {
      unassignedEmployees,
      message: 'Successfully get all unassigned Employees',
    };
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const project = await this.projectRespository.findOneBy({ id });

    console.log(updateProjectDto);
    console.log(project);
    project.name = updateProjectDto.name;
    project.managerId = updateProjectDto.managerId;
    project.description = updateProjectDto.description;
    project.specification = updateProjectDto.specification;
    project.status = updateProjectDto.status;
    project.langFrame = updateProjectDto.langFrame;
    project.technology = updateProjectDto.technology;
    project.startDate = updateProjectDto.startDate;
    project.endDate = updateProjectDto.endDate;
    if (updateProjectDto.employeeRoles) {
      for (const employeeId in updateProjectDto.employeeRoles) {
        const employeeProject = await this.assignRespository.findOne({
          where: { projectId: id, employeeId },
        });
        if (employeeProject) {
          employeeProject.roles = updateProjectDto.employeeRoles[
            employeeId
          ] as any;
          console.log(employeeProject);
          await this.entityManager.save(employeeProject);
        } else {
        }
      }
    }
    await this.entityManager.save(project);
    return { project, message: 'Successfully update project' };
  }

  async remove(id: string) {
    const project = await this.projectRespository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.employee_project', 'employee_project')
      .where('project.id = :id', { id })
      .getOne();
    if (!project) {
      return { message: 'Project not found' };
    }
    if (project.employee_project.length > 0) {
      for (const empProject of project.employee_project) {
        await this.entityManager.remove(empProject);
      }
    }
    await this.projectRespository.softDelete(id);
    return { data: null, message: 'Employee deletion successful' };
  }
}
