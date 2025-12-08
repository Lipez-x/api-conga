import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateExpensesDescription1765219439665 implements MigrationInterface {
    name = 'UpdateExpensesDescription1765219439665'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "utility_cost" ALTER COLUMN "observations" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "personnel_cost" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "operational-cost" ALTER COLUMN "description" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "operational-cost" ALTER COLUMN "description" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "personnel_cost" ALTER COLUMN "description" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "utility_cost" ALTER COLUMN "observations" SET NOT NULL`);
    }

}
