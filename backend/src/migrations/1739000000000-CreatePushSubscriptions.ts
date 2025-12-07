import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreatePushSubscriptions1739000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'push_subscriptions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'endpoint',
            type: 'text',
            isUnique: true,
          },
          {
            name: 'p256dh_key',
            type: 'text',
          },
          {
            name: 'auth_key',
            type: 'text',
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'push_subscriptions',
      new TableIndex({
        name: 'idx_push_subscriptions_endpoint',
        columnNames: ['endpoint'],
      }),
    );

    await queryRunner.createIndex(
      'push_subscriptions',
      new TableIndex({
        name: 'idx_push_subscriptions_user_id',
        columnNames: ['user_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('push_subscriptions');
  }
}

