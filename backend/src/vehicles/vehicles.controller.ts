import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto, UpdateVehicleDto } from './dto';
import { ParseOptionalDatePipe, ParseOptionalUUIDPipe } from '../common/pipes';

@ApiTags('vehicles')
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Создать новый автомобиль' })
  @ApiResponse({ status: 201, description: 'Автомобиль успешно создан' })
  @ApiResponse({ status: 400, description: 'Неверные данные или дубликат VIN/госномера' })
  @ApiResponse({ status: 404, description: 'Клиент не найден' })
  @ApiBody({ type: CreateVehicleDto })
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.create(createVehicleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список автомобилей' })
  @ApiQuery({ name: 'clientId', required: false, type: String, description: 'UUID клиента' })
  @ApiQuery({ name: 'vin', required: false, type: String, description: 'Поиск по VIN' })
  @ApiQuery({ name: 'plateNumber', required: false, type: String, description: 'Поиск по госномеру' })
  @ApiQuery({ name: 'updated_since', required: false, type: String, description: 'Дата обновления (ISO 8601)' })
  @ApiResponse({ status: 200, description: 'Список автомобилей' })
  findAll(
    @Query('clientId', new ParseOptionalUUIDPipe()) clientId?: string,
    @Query('vin') vin?: string,
    @Query('plateNumber') plateNumber?: string,
    @Query('updated_since', new ParseOptionalDatePipe()) updatedSince?: Date,
  ) {
    return this.vehiclesService.findAll(clientId, vin, plateNumber, updatedSince);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить автомобиль по ID' })
  @ApiParam({ name: 'id', type: String, description: 'UUID автомобиля' })
  @ApiResponse({ status: 200, description: 'Данные автомобиля' })
  @ApiResponse({ status: 404, description: 'Автомобиль не найден' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.vehiclesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Частично обновить автомобиль' })
  @ApiParam({ name: 'id', type: String, description: 'UUID автомобиля' })
  @ApiBody({ type: UpdateVehicleDto })
  @ApiResponse({ status: 200, description: 'Автомобиль обновлен' })
  @ApiResponse({ status: 400, description: 'Неверные данные или дубликат VIN/госномера' })
  @ApiResponse({ status: 404, description: 'Автомобиль не найден' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ) {
    return this.vehiclesService.update(id, updateVehicleDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Полностью обновить автомобиль' })
  @ApiParam({ name: 'id', type: String, description: 'UUID автомобиля' })
  @ApiBody({ type: UpdateVehicleDto })
  @ApiResponse({ status: 200, description: 'Автомобиль обновлен' })
  @ApiResponse({ status: 400, description: 'Неверные данные или дубликат VIN/госномера' })
  @ApiResponse({ status: 404, description: 'Автомобиль не найден' })
  put(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ) {
    return this.vehiclesService.update(id, updateVehicleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить автомобиль (soft delete)' })
  @ApiParam({ name: 'id', type: String, description: 'UUID автомобиля' })
  @ApiResponse({ status: 204, description: 'Автомобиль удален' })
  @ApiResponse({ status: 404, description: 'Автомобиль не найден' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.vehiclesService.remove(id);
  }
}

