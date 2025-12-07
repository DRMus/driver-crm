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
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CalendarService } from './calendar.service';
import { CreateCalendarEventDto, UpdateCalendarEventDto } from './dto';
import { ParseOptionalDatePipe, ParseOptionalUUIDPipe, ParseOptionalIntPipe } from '../common/pipes';

@ApiTags('calendar')
@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get('events')
  @ApiOperation({ summary: 'Получить список событий календаря' })
  @ApiQuery({ name: 'dateFrom', required: false, type: String })
  @ApiQuery({ name: 'dateTo', required: false, type: String })
  @ApiQuery({ name: 'isCompleted', required: false, type: Boolean })
  @ApiQuery({ name: 'relatedRepairId', required: false, type: String })
  @ApiQuery({ name: 'relatedClientId', required: false, type: String })
  @ApiQuery({ name: 'updated_since', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Список событий' })
  findAll(
    @Query('dateFrom', ParseOptionalDatePipe) dateFrom?: Date,
    @Query('dateTo', ParseOptionalDatePipe) dateTo?: Date,
    @Query('isCompleted') isCompleted?: string,
    @Query('relatedRepairId', ParseOptionalUUIDPipe) relatedRepairId?: string,
    @Query('relatedClientId', ParseOptionalUUIDPipe) relatedClientId?: string,
    @Query('updated_since', ParseOptionalDatePipe) updatedSince?: Date,
  ) {
    const isCompletedBool = isCompleted === 'true' ? true : isCompleted === 'false' ? false : undefined;
    return this.calendarService.findAll(
      dateFrom,
      dateTo,
      isCompletedBool,
      relatedRepairId,
      relatedClientId,
      updatedSince,
    );
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Получить ближайшие события' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Максимальное количество событий', example: 10 })
  @ApiQuery({ name: 'days', required: false, type: Number, description: 'Количество дней вперед', example: 7 })
  @ApiResponse({ status: 200, description: 'Ближайшие события' })
  findUpcoming(
    @Query('limit', ParseOptionalIntPipe) limit?: number,
    @Query('days', ParseOptionalIntPipe) days?: number,
  ) {
    return this.calendarService.findUpcoming(limit || 10, days || 7);
  }

  @Get('events/:id')
  @ApiOperation({ summary: 'Получить событие по ID' })
  @ApiResponse({ status: 200, description: 'Детали события' })
  @ApiResponse({ status: 404, description: 'Событие не найдено' })
  findOne(@Param('id') id: string) {
    return this.calendarService.findOne(id);
  }

  @Post('events')
  @ApiOperation({ summary: 'Создать событие календаря' })
  @ApiResponse({ status: 201, description: 'Событие успешно создано' })
  @ApiResponse({ status: 400, description: 'Неверные данные запроса' })
  create(@Body() createCalendarEventDto: CreateCalendarEventDto) {
    return this.calendarService.create(createCalendarEventDto);
  }

  @Patch('events/:id')
  @ApiOperation({ summary: 'Обновить событие' })
  @ApiResponse({ status: 200, description: 'Событие успешно обновлено' })
  @ApiResponse({ status: 404, description: 'Событие не найдено' })
  update(@Param('id') id: string, @Body() updateCalendarEventDto: UpdateCalendarEventDto) {
    return this.calendarService.update(id, updateCalendarEventDto);
  }

  @Delete('events/:id')
  @ApiOperation({ summary: 'Удалить событие' })
  @ApiResponse({ status: 200, description: 'Событие успешно удалено' })
  @ApiResponse({ status: 404, description: 'Событие не найдено' })
  remove(@Param('id') id: string) {
    return this.calendarService.remove(id);
  }
}

