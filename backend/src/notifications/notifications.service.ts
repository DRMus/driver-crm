import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as webpush from 'web-push';
import { PushSubscription } from './entities/push-subscription.entity';
import { CreatePushSubscriptionDto } from './dto';
import { CalendarService } from '../calendar/calendar.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private vapidKeys: { publicKey: string; privateKey: string } | null = null;

  constructor(
    @InjectRepository(PushSubscription)
    private readonly subscriptionRepository: Repository<PushSubscription>,
    private readonly configService: ConfigService,
    private readonly calendarService: CalendarService,
  ) {
    this.initializeVapidKeys();
  }

  private initializeVapidKeys() {
    const publicKey = this.configService.get<string>('VAPID_PUBLIC_KEY');
    const privateKey = this.configService.get<string>('VAPID_PRIVATE_KEY');

    if (publicKey && privateKey) {
      this.vapidKeys = { publicKey, privateKey };
      webpush.setVapidDetails(
        this.configService.get<string>('VAPID_SUBJECT', 'mailto:admin@driver-crm.com'),
        publicKey,
        privateKey,
      );
      this.logger.log('VAPID ключи инициализированы');
    } else {
      this.logger.warn('VAPID ключи не настроены. Push-уведомления не будут работать.');
    }
  }

  async createSubscription(dto: CreatePushSubscriptionDto): Promise<PushSubscription> {
    // Проверяем, существует ли уже подписка с таким endpoint
    const existing = await this.subscriptionRepository.findOne({
      where: { endpoint: dto.endpoint },
    });

    if (existing) {
      // Обновляем существующую подписку
      existing.p256dh = dto.p256dh;
      existing.auth = dto.auth;
      if (dto.userId) {
        existing.userId = dto.userId;
      }
      return await this.subscriptionRepository.save(existing);
    }

    // Создаем новую подписку
    const subscription = this.subscriptionRepository.create({
      endpoint: dto.endpoint,
      p256dh: dto.p256dh,
      auth: dto.auth,
      userId: dto.userId,
    });

    return await this.subscriptionRepository.save(subscription);
  }

  async deleteSubscription(endpoint: string): Promise<void> {
    await this.subscriptionRepository.delete({ endpoint });
  }

  async sendNotification(
    subscription: PushSubscription,
    payload: { title: string; body: string; data?: Record<string, unknown> },
  ): Promise<boolean> {
    if (!this.vapidKeys) {
      this.logger.warn('VAPID ключи не настроены. Уведомление не отправлено.');
      return false;
    }

    try {
      const pushSubscription = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.p256dh,
          auth: subscription.auth,
        },
      };

      await webpush.sendNotification(
        pushSubscription,
        JSON.stringify({
          title: payload.title,
          body: payload.body,
          ...payload.data,
        }),
      );

      this.logger.log(`Уведомление отправлено на ${subscription.endpoint}`);
      return true;
    } catch (error: unknown) {
      this.logger.error(`Ошибка отправки уведомления: ${error}`);
      
      // Если подписка недействительна, удаляем её
      if (error && typeof error === 'object' && 'statusCode' in error) {
        const statusCode = (error as { statusCode: number }).statusCode;
        if (statusCode === 410 || statusCode === 404) {
          this.logger.warn(`Подписка недействительна, удаляем: ${subscription.endpoint}`);
          await this.deleteSubscription(subscription.endpoint);
        }
      }
      
      return false;
    }
  }

  async sendNotificationToAll(
    payload: { title: string; body: string; data?: Record<string, unknown> },
  ): Promise<number> {
    const subscriptions = await this.subscriptionRepository.find();
    let successCount = 0;

    for (const subscription of subscriptions) {
      const success = await this.sendNotification(subscription, payload);
      if (success) {
        successCount++;
      }
    }

    return successCount;
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async checkAndSendReminders(): Promise<void> {
    this.logger.log('Проверка напоминаний календаря...');

    try {
      // Получаем события с напоминаниями, которые должны быть отправлены
      const now = new Date();
      const upcomingEvents = await this.calendarService.findUpcoming(100, 1); // Следующие 24 часа

      for (const event of upcomingEvents) {
        if (event.reminderAt && !event.isCompleted) {
          const reminderTime = new Date(event.reminderAt);
          const timeDiff = reminderTime.getTime() - now.getTime();

          // Отправляем напоминание за 15 минут до события
          if (timeDiff > 0 && timeDiff <= 15 * 60 * 1000) {
            // Получаем все активные подписки
            const subscriptions = await this.subscriptionRepository.find();

            for (const subscription of subscriptions) {
              await this.sendNotification(subscription, {
                title: 'Напоминание',
                body: event.title,
                data: {
                  type: 'calendar_reminder',
                  eventId: event.id,
                  eventDate: event.eventDate,
                },
              });
            }
          }
        }
      }

      this.logger.log('Проверка напоминаний завершена');
    } catch (error) {
      this.logger.error(`Ошибка при проверке напоминаний: ${error}`);
    }
  }

  getPublicKey(): string | null {
    return this.vapidKeys?.publicKey || null;
  }
}

