import { MigrationInterface, QueryRunner } from 'typeorm';

export class SuppliesSchema1761786704850 implements MigrationInterface {
  name = 'SuppliesSchema1761786704850';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "supplies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "date" date NOT NULL, "quantity" integer NOT NULL, "unit_price" numeric(10,2) NOT NULL, "total_cost" numeric(10,2) NOT NULL, CONSTRAINT "PK_49c0dc272c9fcf2723bdfd48be1" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "supplies"`);
  }
}
