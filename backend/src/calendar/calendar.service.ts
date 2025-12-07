import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { CalendarEvent } from './entities/calendar-event.entity';
import { CreateCalendarEventDto, UpdateCalendarEventDto } from './dto';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(CalendarEvent)
    private readonly calendarEventsRepository: Repository<CalendarEvent>,
  ) {}

  async create(createCalendarEventDto: CreateCalendarEventDto): Promise<CalendarEvent> {
    const event = this.calendarEventsRepository.create({
      ...createCalendarEventDto,
      eventDate: new Date(createCalendarEventDto.eventDate),
      reminderAt: createCalendarEventDto.reminderAt
        ? new Date(createCalendarEventDto.reminderAt)
        : undefined,
    });

    return await this.calendarEventsRepository.save(event);
  }

  async findAll(
    dateFrom?: Date,
    dateTo?: Date,
    isCompleted?: boolean,
    relatedRepairId?: string,
    relatedClientId?: string,
    updatedSince?: Date,
  ): Promise<CalendarEvent[]> {
    const queryBuilder = this.calendarEventsRepository
      .createQueryBuilder('event')
      .where('event.deletedAt IS NULL');

    if (dateFrom && dateTo) {
      queryBuilder.andWhere('event.eventDate BETWEEN :dateFrom AND :dateTo', {
        dateFrom,
        dateTo,
      });
    } else if (dateFrom) {
      queryBuilder.andWhere('event.eventDate >= :dateFrom', { dateFrom });
    } else if (dateTo) {
      queryBuilder.andWhere('event.eventDate <= :dateTo', { dateTo });
    }

    if (isCompleted !== undefined) {
      queryBuilder.andWhere('event.isCompleted = :isCompleted', { isCompleted });
    }

    if (relatedRepairId) {
      queryBuilder.andWhere('event.relatedRepairId = :relatedRepairId', { relatedRepairId });
    }

    if (relatedClientId) {
      queryBuilder.andWhere('event.relatedClientId = :relatedClientId', { relatedClientId });
    }

    if (updatedSince) {
      queryBuilder.andWhere('event.updatedAt >= :updatedSince', { updatedSince });
    }

    queryBuilder.orderBy('event.eventDate', 'ASC');

    return await queryBuilder.getMany();
  }

  async findUpcoming(limit: number = 10, days: number = 7): Promise<CalendarEvent[]> {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return await this.calendarEventsRepository.find({
      where: {
        deletedAt: null,
        isCompleted: false,
        eventDate: Between(now, futureDate),
      },
      order: {
        eventDate: 'ASC',
      },
      take: limit,
    });
  }

  async findOne(id: string): Promise<CalendarEvent> {
    const event = await this.calendarEventsRepository.findOne({
      where: { id, deletedAt: null },
    });

    if (!event) {
      throw new NotFoundException(`Событие с ID ${id} не найдено`);
    }

    return event;
  }

  async update(id: string, updateCalendarEventDto: UpdateCalendarEventDto): Promise<CalendarEvent> {
    const event = await this.findOne(id);

    if (updateCalendarEventDto.eventDate) {
      event.eventDate = new Date(updateCalendarEventDto.eventDate);
    }

    if (updateCalendarEventDto.reminderAt !== undefined) {
      event.reminderAt = updateCalendarEventDto.reminderAt
        ? new Date(updateCalendarEventDto.reminderAt)
        : null;
    }

    Object.assign(event, {
      ...updateCalendarEventDto,
      eventDate: event.eventDate,
      reminderAt: event.reminderAt,
    });

    return await this.calendarEventsRepository.save(event);
  }

  async remove(id: string): Promise<void> {
    const event = await this.findOne(id);
    await this.calendarEventsRepository.softRemove(event);
  }
}

