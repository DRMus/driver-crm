import { MigrationInterface, QueryRunner } from 'typeorm';

export class RecalculateRepairGrandTotal1739500000000 implements MigrationInterface {
  name = 'RecalculateRepairGrandTotal1739500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Пересчитываем grand_total для всех ремонтов как сумма labor_total + parts_total
    // Используем COALESCE для обработки NULL значений
    await queryRunner.query(`
      UPDATE repairs 
      SET grand_total = COALESCE(labor_total, 0) + COALESCE(parts_total, 0)
      WHERE grand_total != (COALESCE(labor_total, 0) + COALESCE(parts_total, 0))
         OR grand_total IS NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Откат миграции не требуется, так как мы просто исправляем данные
    // Можно оставить пустым или пересчитать обратно, но это не имеет смысла
  }
}

