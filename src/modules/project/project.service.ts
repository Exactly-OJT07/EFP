import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { EntityManager, Repository } from 'typeorm';
import { Project } from '../../entities/project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GetProjectParams } from './dto/getList-project.dto';
import { Order } from 'src/common/enum/enums';
import { PageMetaDto } from 'src/common/dtos/pageMeta';
import { ResponsePaginate } from 'src/common/dtos/responsePaginate';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRespository: Repository<Project>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    const project = new Project(createProjectDto);
    await this.entityManager.save(project);
  }

  async getProjects(params: GetProjectParams) {
    const projects = this.projectRespository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.managerProject', 'manager')
      .leftJoinAndSelect('project.employee_project', 'employee_project')
      .leftJoinAndSelect('employee_project.employee', 'employee')
      .skip(params.skip)
      .take(params.take)
      .orderBy('project.createdAt', Order.DESC);

    if (params.name) {
      projects.andWhere('project.name ILIKE :name', {
        name: `%${params.name}%`,
      });
    }

    const [result, total] = await projects.getManyAndCount();

    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: params,
    });

    return new ResponsePaginate(result, pageMetaDto, 'Success');
  }

  // async findAll() {
  //   return this.projectsRespository.find();
  // }

  async findOne(id: string) {
    return this.projectRespository.findOneBy({ id });
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
  }

  async remove(id: string) {
    await this.projectRespository.softDelete(id);
  }
}
