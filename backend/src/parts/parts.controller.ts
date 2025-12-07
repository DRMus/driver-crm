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
import { PartsService } from './parts.service';
import { CreatePartDto, UpdatePartDto } from './dto';
import { ParseOptionalUUIDPipe } from '../common/pipes';

@ApiTags('parts')
@Controller('parts')
export class PartsController {
  constructor(private readonly partsService: PartsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать запчасть' })
  @ApiResponse({ status: 201, description: 'Запчасть успешно создана' })
  create(@Body() createPartDto: CreatePartDto) {
    return this.partsService.create(createPartDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список запчастей' })
  @ApiResponse({ status: 200, description: 'Список запчастей' })
  findAll(@Query('repairId', ParseOptionalUUIDPipe) repairId?: string) {
    return this.partsService.findAll(repairId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить запчасть по ID' })
  @ApiResponse({ status: 200, description: 'Запчасть найдена' })
  @ApiResponse({ status: 404, description: 'Запчасть не найдена' })
  findOne(@Param('id') id: string) {
    return this.partsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить запчасть' })
  @ApiResponse({ status: 200, description: 'Запчасть успешно обновлена' })
  update(@Param('id') id: string, @Body() updatePartDto: UpdatePartDto) {
    return this.partsService.update(id, updatePartDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить запчасть' })
  @ApiResponse({ status: 200, description: 'Запчасть успешно удалена' })
  remove(@Param('id') id: string) {
    return this.partsService.remove(id);
  }
}

