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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RepairTasksService } from './repair-tasks.service';
import { CreateRepairTaskDto, UpdateRepairTaskDto } from './dto';
import { ParseOptionalUUIDPipe } from '../common/pipes';

@ApiTags('repair-tasks')
@Controller('repair-tasks')
export class RepairTasksController {
  constructor(private readonly repairTasksService: RepairTasksService) {}

  @Post()
  @ApiOperation({ summary: 'Создать работу' })
  @ApiResponse({ status: 201, description: 'Работа успешно создана' })
  create(@Body() createRepairTaskDto: CreateRepairTaskDto) {
    return this.repairTasksService.create(createRepairTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список работ' })
  @ApiResponse({ status: 200, description: 'Список работ' })
  findAll(@Query('repairId', ParseOptionalUUIDPipe) repairId?: string) {
    return this.repairTasksService.findAll(repairId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить работу по ID' })
  @ApiResponse({ status: 200, description: 'Работа найдена' })
  @ApiResponse({ status: 404, description: 'Работа не найдена' })
  findOne(@Param('id') id: string) {
    return this.repairTasksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить работу' })
  @ApiResponse({ status: 200, description: 'Работа успешно обновлена' })
  update(@Param('id') id: string, @Body() updateRepairTaskDto: UpdateRepairTaskDto) {
    return this.repairTasksService.update(id, updateRepairTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить работу' })
  @ApiResponse({ status: 200, description: 'Работа успешно удалена' })
  remove(@Param('id') id: string) {
    return this.repairTasksService.remove(id);
  }
}

