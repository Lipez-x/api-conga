import { MigrationInterface, QueryRunner } from "typeorm";

export class CascadeExpenses1762231691665 implements MigrationInterface {
    name = 'CascadeExpenses1762231691665'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "personnel_cost" DROP CONSTRAINT "FK_bf5317bc0626f1a1889adefc683"`);
        await queryRunner.query(`ALTER TABLE "utility_cost" DROP CONSTRAINT "FK_c6722fc568ad3e7386a8b81b246"`);
        await queryRunner.query(`ALTER TABLE "supplies" DROP CONSTRAINT "FK_7173318bb9619ce069f56d79489"`);
        await queryRunner.query(`ALTER TABLE "operational-cost" DROP CONSTRAINT "FK_716e6544ba5ba9a06c621dd699e"`);
        await queryRunner.query(`ALTER TABLE "personnel_cost" ADD CONSTRAINT "FK_bf5317bc0626f1a1889adefc683" FOREIGN KEY ("expenseId") REFERENCES "expenses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "utility_cost" ADD CONSTRAINT "FK_c6722fc568ad3e7386a8b81b246" FOREIGN KEY ("expenseId") REFERENCES "expenses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "supplies" ADD CONSTRAINT "FK_7173318bb9619ce069f56d79489" FOREIGN KEY ("expenseId") REFERENCES "expenses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "operational-cost" ADD CONSTRAINT "FK_716e6544ba5ba9a06c621dd699e" FOREIGN KEY ("expenseId") REFERENCES "expenses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "operational-cost" DROP CONSTRAINT "FK_716e6544ba5ba9a06c621dd699e"`);
        await queryRunner.query(`ALTER TABLE "supplies" DROP CONSTRAINT "FK_7173318bb9619ce069f56d79489"`);
        await queryRunner.query(`ALTER TABLE "utility_cost" DROP CONSTRAINT "FK_c6722fc568ad3e7386a8b81b246"`);
        await queryRunner.query(`ALTER TABLE "personnel_cost" DROP CONSTRAINT "FK_bf5317bc0626f1a1889adefc683"`);
        await queryRunner.query(`ALTER TABLE "operational-cost" ADD CONSTRAINT "FK_716e6544ba5ba9a06c621dd699e" FOREIGN KEY ("expenseId") REFERENCES "expenses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "supplies" ADD CONSTRAINT "FK_7173318bb9619ce069f56d79489" FOREIGN KEY ("expenseId") REFERENCES "expenses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "utility_cost" ADD CONSTRAINT "FK_c6722fc568ad3e7386a8b81b246" FOREIGN KEY ("expenseId") REFERENCES "expenses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "personnel_cost" ADD CONSTRAINT "FK_bf5317bc0626f1a1889adefc683" FOREIGN KEY ("expenseId") REFERENCES "expenses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
