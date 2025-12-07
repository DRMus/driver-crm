import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeMoneyFieldsToNumeric1737129600000 implements MigrationInterface {
  name = 'ChangeMoneyFieldsToNumeric1737129600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Изменяем типы денежных полей в таблице repairs с integer на numeric(10,2)
    await queryRunner.query(`
      ALTER TABLE repairs 
      ALTER COLUMN labor_total TYPE numeric(10,2) USING labor_total::numeric(10,2),
      ALTER COLUMN parts_total TYPE numeric(10,2) USING parts_total::numeric(10,2),
      ALTER COLUMN grand_total TYPE numeric(10,2) USING grand_total::numeric(10,2);
    `);

    // Если таблица repair_tasks существует, обновляем её поля
    const repairTasksTable = await queryRunner.getTable('repair_tasks');
    if (repairTasksTable) {
      await queryRunner.query(`
        ALTER TABLE repair_tasks 
        ALTER COLUMN labor_rate TYPE numeric(10,2) USING labor_rate::numeric(10,2),
        ALTER COLUMN price TYPE numeric(10,2) USING price::numeric(10,2);
      `);
    }

    // Таблица parts уже должна иметь правильные типы, но на всякий случай проверим
    const partsTable = await queryRunner.getTable('parts');
    if (partsTable) {
      const purchasePriceColumn = partsTable.findColumnByName('purchase_price');
      const salePriceColumn = partsTable.findColumnByName('sale_price');
      
      if (purchasePriceColumn && purchasePriceColumn.type !== 'numeric') {
        await queryRunner.query(`
          ALTER TABLE parts 
          ALTER COLUMN purchase_price TYPE numeric(10,2) USING purchase_price::numeric(10,2);
        `);
      }
      
      if (salePriceColumn && salePriceColumn.type !== 'numeric') {
        await queryRunner.query(`
          ALTER TABLE parts 
          ALTER COLUMN sale_price TYPE numeric(10,2) USING sale_price::numeric(10,2);
        `);
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Откат изменений: возвращаем integer (но данные могут потерять точность)
    await queryRunner.query(`
      ALTER TABLE repairs 
      ALTER COLUMN labor_total TYPE integer USING ROUND(labor_total)::integer,
      ALTER COLUMN parts_total TYPE integer USING ROUND(parts_total)::integer,
      ALTER COLUMN grand_total TYPE integer USING ROUND(grand_total)::integer;
    `);

    const repairTasksTable = await queryRunner.getTable('repair_tasks');
    if (repairTasksTable) {
      await queryRunner.query(`
        ALTER TABLE repair_tasks 
        ALTER COLUMN labor_rate TYPE integer USING ROUND(labor_rate)::integer,
        ALTER COLUMN price TYPE integer USING ROUND(price)::integer;
      `);
    }

    const partsTable = await queryRunner.getTable('parts');
    if (partsTable) {
      const purchasePriceColumn = partsTable.findColumnByName('purchase_price');
      const salePriceColumn = partsTable.findColumnByName('sale_price');
      
      if (purchasePriceColumn && purchasePriceColumn.type === 'numeric') {
        await queryRunner.query(`
          ALTER TABLE parts 
          ALTER COLUMN purchase_price TYPE integer USING ROUND(purchase_price)::integer;
        `);
      }
      
      if (salePriceColumn && salePriceColumn.type === 'numeric') {
        await queryRunner.query(`
          ALTER TABLE parts 
          ALTER COLUMN sale_price TYPE integer USING ROUND(sale_price)::integer;
        `);
      }
    }
  }
}

