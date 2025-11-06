import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductionSchema1762409279244 implements MigrationInterface {
    name = 'ProductionSchema1762409279244'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "production" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" date NOT NULL, "gross_quantity" numeric(10,2) NOT NULL, "consumed_quantity" numeric(10,2) NOT NULL, "sellable_quantity" numeric(10,2) NOT NULL, CONSTRAINT "PK_722753196a878fa7473f0381da3" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "production"`);
    }

}
