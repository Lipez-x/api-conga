import { MigrationInterface, QueryRunner } from "typeorm";

export class ProducerProductionDeletedAt1763722998581 implements MigrationInterface {
    name = 'ProducerProductionDeletedAt1763722998581'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "producer_production_request" ADD "validatedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "producer_production_request" DROP COLUMN "validatedAt"`);
    }

}
