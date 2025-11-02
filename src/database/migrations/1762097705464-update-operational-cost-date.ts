import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOperationalCostDate1762097705464 implements MigrationInterface {
    name = 'UpdateOperationalCostDate1762097705464'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "operational-cost" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "operational-cost" ADD "date" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "operational-cost" ALTER COLUMN "description" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "operational-cost" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "operational-cost" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "operational-cost" ADD "date" TIME NOT NULL`);
    }

}
