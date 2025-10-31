import { MigrationInterface, QueryRunner } from 'typeorm';

export class OperationalCostsTable1761934530294 implements MigrationInterface {
  name = 'OperationalCostsTable1761934530294';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."operational-cost_type_enum" AS ENUM('Higiene', 'Manutenção de Equipamentos')`,
    );
    await queryRunner.query(
      `CREATE TABLE "operational-cost" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."operational-cost_type_enum" NOT NULL, "date" TIME NOT NULL, "value" numeric(12,2) NOT NULL, "description" text, CONSTRAINT "PK_46f2e63718eeda43e1a8c87b1dd" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "operational-cost"`);
    await queryRunner.query(`DROP TYPE "public"."operational-cost_type_enum"`);
  }
}
