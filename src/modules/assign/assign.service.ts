import { Injectable } from '@nestjs/common';
import { CreateAssignDto } from './dto/create-assign.dto';
import { UpdateAssignDto } from './dto/update-assign.dto';
import { EmployeeProject } from 'src/entities/employee_project.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GetAssignParams } from './dto/getList-assign.dto';
import { Order } from 'src/common/enum/enums';
import { PageMetaDto } from 'src/common/dtos/pageMeta';
import { ResponsePaginate } from 'src/common/dtos/responsePaginate';

@Injectable()
export class AssignService {
  constructor(
    @InjectRepository(EmployeeProject)
    private assignRespository: Repository<EmployeeProject>,
    private readonly entityManager: EntityManager,
  ) {}

  async assignEmployeeToProject(assignDto: CreateAssignDto) {
    const { employeeId, projectId, role, joinDate, fireDate } = assignDto;

    const employeeProject = new EmployeeProject(assignDto);
    employeeProject.employeeId = employeeId;
    employeeProject.projectId = projectId;
    employeeProject.role = role;
    employeeProject.joinDate = joinDate;
    employeeProject.fireDate = fireDate;

    await this.entityManager.save(employeeProject);
  }

  async getAssigns(params: GetAssignParams) {
    const assigns = this.assignRespository
      .createQueryBuilder('employee_project')
      .select(['employee_project', 'employee'])
      .leftJoin('employee_project.employee', 'employee')
      .skip(params.skip)
      .take(params.take)
      .orderBy('employee_project.createdAt', Order.DESC);

    if (params.id) {
      assigns.andWhere('employee_project.name ILIKE :name', {
        name: `%${params.id}%`,
      });
    }

    const [result, total] = await assigns.getManyAndCount();

    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: params,
    });

    return new ResponsePaginate(result, pageMetaDto, 'Success');
  }

  async getAssignById(id: string) {
    const assign = await this.assignRespository
      .createQueryBuilder('employee_project')
      .select(['employee_project', 'employee'])
      .leftJoin('employee_project.employee', 'employee')
      .where('employee_project.id = :id', { id })
      .getOne();
    return assign;
  }

  async update(id: string, updateProjectDto: UpdateAssignDto) {
    const project = await this.assignRespository.findOneBy({ id });
    project.role = updateProjectDto.role;
    project.joinDate = updateProjectDto.joinDate;
    project.fireDate = updateProjectDto.fireDate;
    await this.entityManager.save(project);
  }

  async remove(id: string) {
    await this.assignRespository.softDelete(id);
  }
}
