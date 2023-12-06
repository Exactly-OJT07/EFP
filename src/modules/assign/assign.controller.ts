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
import { AssignService } from './assign.service';
import { CreateAssignDto } from './dto/create-assign.dto';
import { UpdateAssignDto } from './dto/update-assign.dto';
import { GetAssignParams } from './dto/getList-assign.dto';

@Controller('assign')
export class AssignController {
  constructor(private readonly assignService: AssignService) {}

  @Post()
  create(@Body() createAssignDto: CreateAssignDto) {
    return this.assignService.assignEmployeeToProject(createAssignDto);
  }

  @Get()
  findAll(@Query() params: GetAssignParams) {
    return this.assignService.getAssigns(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assignService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAssignDto: UpdateAssignDto) {
    return this.assignService.update(id, updateAssignDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assignService.remove(id);
  }
}
