import { MigrationInterface, QueryRunner } from 'typeorm';

export class LocalProductionSchema1762757366427 implements MigrationInterface {
  name = 'LocalProductionSchema1762757366427';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "local_production" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" date NOT NULL, "gross_quantity" numeric(10,2) NOT NULL, "consumed_quantity" numeric(10,2) NOT NULL, "total_quantity" numeric(10,2) NOT NULL, "receiveId" uuid, CONSTRAINT "PK_fdd4986d7d48f9507f50efac80b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bf2004a6b656a1929d5cad43e4" ON "local_production" ("date") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bf2004a6b656a1929d5cad43e4"`,
    );
    await queryRunner.query(`DROP TABLE "local_production"`);
  }
}
