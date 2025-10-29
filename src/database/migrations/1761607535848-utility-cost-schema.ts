import { MigrationInterface, QueryRunner } from 'typeorm';

export class UtilityCostSchema1761607535848 implements MigrationInterface {
  name = 'UtilityCostSchema1761607535848';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."utility_cost_type_enum" AS ENUM('Energia', 'Água', 'Internet', 'Telefone')`,
    );
    await queryRunner.query(
      `CREATE TABLE "utility_cost" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."utility_cost_type_enum" NOT NULL, "date" date NOT NULL, "value" numeric(12,2) NOT NULL, "observations" text NOT NULL, CONSTRAINT "PK_e6326c74869bd9e22bb390ec753" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "personnel_cost" ALTER COLUMN "description" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "personnel_cost" ALTER COLUMN "description" DROP NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "utility_cost"`);
    await queryRunner.query(`DROP TYPE "public"."utility_cost_type_enum"`);
  }
}
