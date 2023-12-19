import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { GetProjectParams } from './dto/getList-project.dto';
// import { AuthGuard } from './auth.guard';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  // @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto);
  }

  @Get('total')
  getTotalEmployee(@Query('period') period: string) {
    return this.projectService.getTotalProject(period);
  }

  @Get()
  findAll(@Query() params: GetProjectParams) {
    return this.projectService.getProjects(params);
  }

  @Get('deleted')
  async getProjectDeleted(@Query() params: GetProjectParams) {
    return this.projectService.getProjectDeleted(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.getProjectById(id);
  }

  @Get(':id/unassigned')
  async findUnassignedEmployees(@Param('id') id: string) {
    return this.projectService.getUnassignedEmployeesInProject(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(id, updateProjectDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.projectService.remove(id);
    if (result.message) {
      return { message: result.message };
    } else {
      return { data: result.data, message: 'Success' };
    }
  }
}
