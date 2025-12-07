import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveRepairStatus1738500000000 implements MigrationInterface {
  name = 'RemoveRepairStatus1738500000000';
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Удаляем колонку status из таблицы repairs
    await queryRunner.query(`
      ALTER TABLE repairs 
      DROP COLUMN IF EXISTS status;
    `);

    // Удаляем enum тип, если он существует
    await queryRunner.query(`
      DROP TYPE IF EXISTS "repair_status_enum";
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Восстанавливаем enum тип
    await queryRunner.query(`
      CREATE TYPE "repair_status_enum" AS ENUM ('draft', 'in_progress', 'done', 'cancelled');
    `);

    // Восстанавливаем колонку status
    await queryRunner.query(`
      ALTER TABLE repairs 
      ADD COLUMN status "repair_status_enum" NOT NULL DEFAULT 'draft';
    `);
  }
}

