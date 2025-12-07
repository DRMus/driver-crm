import {
  Controller,
  Get,
  Query,
  Res,
  Header,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { AccountingService } from './accounting.service';
import { ReportQueryDto, ReportGroupBy } from './dto';

@ApiTags('Отчеты')
@Controller('reports')
export class AccountingController {
  constructor(private readonly accountingService: AccountingService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Получить сводный отчет с группировкой' })
  @ApiQuery({ name: 'from', required: false, description: 'Дата начала (ISO 8601)' })
  @ApiQuery({ name: 'to', required: false, description: 'Дата окончания (ISO 8601)' })
  @ApiQuery({ name: 'groupBy', required: false, enum: ReportGroupBy, description: 'Группировка: day, week, month' })
  @ApiResponse({ status: 200, description: 'Сводный отчет' })
  getSummary(@Query() query: ReportQueryDto) {
    return this.accountingService.getSummary(query);
  }

  @Get('daily')
  @ApiOperation({ summary: 'Получить дневной отчет с детализацией' })
  @ApiQuery({ name: 'from', required: false, description: 'Дата начала (ISO 8601)' })
  @ApiQuery({ name: 'to', required: false, description: 'Дата окончания (ISO 8601)' })
  @ApiResponse({ status: 200, description: 'Дневной отчет' })
  getDaily(@Query() query: ReportQueryDto) {
    return this.accountingService.getDailyReport(query);
  }

  @Get('export')
  @ApiOperation({ summary: 'Экспорт отчета в CSV' })
  @ApiQuery({ name: 'from', required: false, description: 'Дата начала (ISO 8601)' })
  @ApiQuery({ name: 'to', required: false, description: 'Дата окончания (ISO 8601)' })
  @ApiQuery({ name: 'groupBy', required: false, enum: ReportGroupBy, description: 'Группировка: day, week, month' })
  @ApiResponse({ status: 200, description: 'CSV файл' })
  @Header('Content-Type', 'text/csv; charset=utf-8')
  @Header('Content-Disposition', 'attachment; filename="report.csv"')
  async exportCSV(@Query() query: ReportQueryDto, @Res() res: Response) {
    const csv = await this.accountingService.exportToCSV(query);
    res.send(csv);
  }
}

