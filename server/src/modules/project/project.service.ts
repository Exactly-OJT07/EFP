/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { EntityManager, Repository } from 'typeorm';
import { Project } from '../../entities/project.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectsRespository: Repository<Project>,
    private readonly entityManager: EntityManager,
    ) {}

  async create( createProjectDto: CreateProjectDto) {
    const project = new Project(createProjectDto);
    await this.entityManager.save(project);
  }

  async findAll() {
    return this.projectsRespository.find();
  }

  async findOne(id: string) {
    return this.projectsRespository.findOneBy({ id });
  }
  
  update(id: number, _updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
