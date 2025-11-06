import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProducerNameInProducion1762411388980 implements MigrationInterface {
    name = 'AddProducerNameInProducion1762411388980'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "production" ADD "producer_name" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "production" DROP COLUMN "producer_name"`);
    }

}
