import { MigrationInterface, QueryRunner } from 'typeorm';

export class PersonnelCostSchema1761511082373 implements MigrationInterface {
  name = 'PersonnelCostSchema1761511082373';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."personnel_cost_type_enum" AS ENUM('Salários Fixos', 'Terceirizados', 'Encargos', 'Benefícios')`,
    );
    await queryRunner.query(
      `CREATE TABLE "personnel_cost" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."personnel_cost_type_enum" NOT NULL, "date" date NOT NULL, "value" numeric(12,2) NOT NULL, "description" text, CONSTRAINT "PK_372273548cccb5f905d270d6160" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "personnel_cost"`);
  }
}
