import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private supabaseClient: SupabaseClient;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_ANON_KEY');

    if (supabaseUrl && supabaseKey) {
      this.supabaseClient = createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: false,
        },
      });
    } else {
      console.warn(
        'Supabase не настроен: SUPABASE_URL и SUPABASE_ANON_KEY не установлены в переменных окружения',
      );
    }
  }

  getClient(): SupabaseClient | null {
    if (!this.supabaseClient) {
      throw new Error(
        'Supabase клиент не инициализирован. Убедитесь, что SUPABASE_URL и SUPABASE_ANON_KEY установлены в переменных окружения.',
      );
    }
    return this.supabaseClient;
  }

  // Методы для работы с базой данных
  get table() {
    if (!this.supabaseClient) {
      throw new Error(
        'Supabase клиент не инициализирован. Убедитесь, что SUPABASE_URL и SUPABASE_ANON_KEY установлены в переменных окружения.',
      );
    }
    return this.supabaseClient.from.bind(this.supabaseClient);
  }

  // Методы для работы с аутентификацией
  get auth() {
    if (!this.supabaseClient) {
      throw new Error(
        'Supabase клиент не инициализирован. Убедитесь, что SUPABASE_URL и SUPABASE_ANON_KEY установлены в переменных окружения.',
      );
    }
    return this.supabaseClient.auth;
  }

  // Проверка доступности Supabase
  isInitialized(): boolean {
    return !!this.supabaseClient;
  }
}

