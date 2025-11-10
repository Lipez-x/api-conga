import { MigrationInterface, QueryRunner } from "typeorm";

export class ProducerProductionSchema1762760948798 implements MigrationInterface {
    name = 'ProducerProductionSchema1762760948798'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "producer_production" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" date NOT NULL, "producer_name" text NOT NULL, "total_quantity" numeric(10,2) NOT NULL, CONSTRAINT "PK_97f18bfe9cc7545293d0655e1dd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_bcbd0f9c708715ea089ef8f4d1" ON "producer_production" ("date") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_bcbd0f9c708715ea089ef8f4d1"`);
        await queryRunner.query(`DROP TABLE "producer_production"`);
    }

}
