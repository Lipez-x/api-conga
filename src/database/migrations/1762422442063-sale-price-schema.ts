import { MigrationInterface, QueryRunner } from "typeorm";

export class SalePriceSchema1762422442063 implements MigrationInterface {
    name = 'SalePriceSchema1762422442063'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sale_price" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" numeric(10,2) NOT NULL, "startDate" date NOT NULL, "endDate" date NOT NULL, CONSTRAINT "PK_16924f33c9cec7a2034f07073bc" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "sale_price"`);
    }

}
