import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { RepairsService } from './repairs.service';
import { CreateRepairDto, UpdateRepairDto } from './dto';
import { ParseOptionalUUIDPipe } from '../common/pipes/parse-optional-uuid.pipe';
import { ParseOptionalDatePipe } from '../common/pipes/parse-optional-date.pipe';
import { ParseOptionalIntPipe } from '../common/pipes/parse-optional-int.pipe';

@ApiTags('Ремонты')
@Controller('repairs')
export class RepairsController {
  constructor(private readonly repairsService: RepairsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать ремонт' })
  @ApiResponse({ status: 201, description: 'Ремонт успешно создан' })
  @ApiResponse({ status: 400, description: 'Неверные данные' })
  @ApiResponse({ status: 404, description: 'Автомобиль не найден' })
  create(@Body() createRepairDto: CreateRepairDto) {
    return this.repairsService.create(createRepairDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список ремонтов' })
  @ApiQuery({ name: 'vehicleId', required: false, description: 'ID автомобиля' })
  @ApiQuery({ name: 'dateFrom', required: false, description: 'Дата начала (ISO string)' })
  @ApiQuery({ name: 'dateTo', required: false, description: 'Дата окончания (ISO string)' })
  @ApiQuery({ name: 'updated_since', required: false, description: 'Обновлено после (ISO string)' })
  @ApiResponse({ status: 200, description: 'Список ремонтов' })
  findAll(
    @Query('vehicleId', ParseOptionalUUIDPipe) vehicleId?: string,
    @Query('dateFrom', ParseOptionalDatePipe) dateFrom?: Date,
    @Query('dateTo', ParseOptionalDatePipe) dateTo?: Date,
    @Query('updated_since', ParseOptionalDatePipe) updatedSince?: Date,
  ) {
    return this.repairsService.findAll(vehicleId, dateFrom, dateTo, updatedSince);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить ремонт по ID' })
  @ApiParam({ name: 'id', description: 'ID ремонта' })
  @ApiResponse({ status: 200, description: 'Ремонт найден' })
  @ApiResponse({ status: 404, description: 'Ремонт не найден' })
  findOne(@Param('id') id: string) {
    return this.repairsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить ремонт' })
  @ApiParam({ name: 'id', description: 'ID ремонта' })
  @ApiResponse({ status: 200, description: 'Ремонт обновлен' })
  @ApiResponse({ status: 404, description: 'Ремонт не найден' })
  update(@Param('id') id: string, @Body() updateRepairDto: UpdateRepairDto) {
    return this.repairsService.update(id, updateRepairDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить ремонт' })
  @ApiParam({ name: 'id', description: 'ID ремонта' })
  @ApiResponse({ status: 204, description: 'Ремонт удален' })
  @ApiResponse({ status: 404, description: 'Ремонт не найден' })
  remove(@Param('id') id: string) {
    return this.repairsService.remove(id);
  }

  @Post(':id/recalculate')
  @ApiOperation({ summary: 'Пересчитать итоги ремонта' })
  @ApiParam({ name: 'id', description: 'ID ремонта' })
  @ApiResponse({ status: 200, description: 'Итоги пересчитаны' })
  @ApiResponse({ status: 404, description: 'Ремонт не найден' })
  recalculateTotals(@Param('id') id: string) {
    return this.repairsService.recalculateTotals(id);
  }
}

