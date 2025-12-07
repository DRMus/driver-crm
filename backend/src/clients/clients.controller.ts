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
import { ClientsService } from './clients.service';
import { CreateClientDto, UpdateClientDto } from './dto';
import { ParseOptionalIntPipe, ParseOptionalDatePipe } from '../common/pipes';

@ApiTags('clients')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Создать нового клиента' })
  @ApiResponse({ status: 201, description: 'Клиент успешно создан' })
  @ApiResponse({ status: 400, description: 'Неверные данные' })
  @ApiBody({ type: CreateClientDto })
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список клиентов' })
  @ApiQuery({ name: 'search', required: false, description: 'Поиск по имени, телефону или email' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Лимит записей' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Смещение' })
  @ApiQuery({ name: 'updated_since', required: false, type: String, description: 'Дата обновления (ISO 8601)' })
  @ApiResponse({ status: 200, description: 'Список клиентов' })
  findAll(
    @Query('search') search?: string,
    @Query('limit', new ParseOptionalIntPipe()) limit?: number,
    @Query('offset', new ParseOptionalIntPipe()) offset?: number,
    @Query('updated_since', new ParseOptionalDatePipe()) updatedSince?: Date,
  ) {
    return this.clientsService.findAll(search, limit, offset, updatedSince);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить клиента по ID' })
  @ApiParam({ name: 'id', type: String, description: 'UUID клиента' })
  @ApiResponse({ status: 200, description: 'Данные клиента' })
  @ApiResponse({ status: 404, description: 'Клиент не найден' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Частично обновить клиента' })
  @ApiParam({ name: 'id', type: String, description: 'UUID клиента' })
  @ApiBody({ type: UpdateClientDto })
  @ApiResponse({ status: 200, description: 'Клиент обновлен' })
  @ApiResponse({ status: 404, description: 'Клиент не найден' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return this.clientsService.update(id, updateClientDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Полностью обновить клиента' })
  @ApiParam({ name: 'id', type: String, description: 'UUID клиента' })
  @ApiBody({ type: UpdateClientDto })
  @ApiResponse({ status: 200, description: 'Клиент обновлен' })
  @ApiResponse({ status: 404, description: 'Клиент не найден' })
  put(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить клиента (soft delete)' })
  @ApiParam({ name: 'id', type: String, description: 'UUID клиента' })
  @ApiResponse({ status: 204, description: 'Клиент удален' })
  @ApiResponse({ status: 404, description: 'Клиент не найден' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.clientsService.remove(id);
  }
}

