import { MigrationInterface, QueryRunner } from "typeorm";

export class ExpensesSchema1762180100951 implements MigrationInterface {
    name = 'ExpensesSchema1762180100951'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."expenses_category_enum" AS ENUM('PERSONNEL', 'UTILITY', 'SUPPLIES', 'OPERATIONAL')`);
        await queryRunner.query(`CREATE TABLE "expenses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" date NOT NULL, "value" numeric(12,2) NOT NULL, "category" "public"."expenses_category_enum" NOT NULL, CONSTRAINT "PK_94c3ceb17e3140abc9282c20610" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "personnel_cost" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "personnel_cost" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "utility_cost" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "utility_cost" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "supplies" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "supplies" DROP COLUMN "total_cost"`);
        await queryRunner.query(`ALTER TABLE "operational-cost" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "operational-cost" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "personnel_cost" ADD "expenseId" uuid`);
        await queryRunner.query(`ALTER TABLE "personnel_cost" ADD CONSTRAINT "UQ_bf5317bc0626f1a1889adefc683" UNIQUE ("expenseId")`);
        await queryRunner.query(`ALTER TABLE "utility_cost" ADD "expenseId" uuid`);
        await queryRunner.query(`ALTER TABLE "utility_cost" ADD CONSTRAINT "UQ_c6722fc568ad3e7386a8b81b246" UNIQUE ("expenseId")`);
        await queryRunner.query(`ALTER TABLE "supplies" ADD "expenseId" uuid`);
        await queryRunner.query(`ALTER TABLE "supplies" ADD CONSTRAINT "UQ_7173318bb9619ce069f56d79489" UNIQUE ("expenseId")`);
        await queryRunner.query(`ALTER TABLE "operational-cost" ADD "expenseId" uuid`);
        await queryRunner.query(`ALTER TABLE "operational-cost" ADD CONSTRAINT "UQ_716e6544ba5ba9a06c621dd699e" UNIQUE ("expenseId")`);
        await queryRunner.query(`ALTER TABLE "personnel_cost" ADD CONSTRAINT "FK_bf5317bc0626f1a1889adefc683" FOREIGN KEY ("expenseId") REFERENCES "expenses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "utility_cost" ADD CONSTRAINT "FK_c6722fc568ad3e7386a8b81b246" FOREIGN KEY ("expenseId") REFERENCES "expenses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "supplies" ADD CONSTRAINT "FK_7173318bb9619ce069f56d79489" FOREIGN KEY ("expenseId") REFERENCES "expenses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "operational-cost" ADD CONSTRAINT "FK_716e6544ba5ba9a06c621dd699e" FOREIGN KEY ("expenseId") REFERENCES "expenses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "operational-cost" DROP CONSTRAINT "FK_716e6544ba5ba9a06c621dd699e"`);
        await queryRunner.query(`ALTER TABLE "supplies" DROP CONSTRAINT "FK_7173318bb9619ce069f56d79489"`);
        await queryRunner.query(`ALTER TABLE "utility_cost" DROP CONSTRAINT "FK_c6722fc568ad3e7386a8b81b246"`);
        await queryRunner.query(`ALTER TABLE "personnel_cost" DROP CONSTRAINT "FK_bf5317bc0626f1a1889adefc683"`);
        await queryRunner.query(`ALTER TABLE "operational-cost" DROP CONSTRAINT "UQ_716e6544ba5ba9a06c621dd699e"`);
        await queryRunner.query(`ALTER TABLE "operational-cost" DROP COLUMN "expenseId"`);
        await queryRunner.query(`ALTER TABLE "supplies" DROP CONSTRAINT "UQ_7173318bb9619ce069f56d79489"`);
        await queryRunner.query(`ALTER TABLE "supplies" DROP COLUMN "expenseId"`);
        await queryRunner.query(`ALTER TABLE "utility_cost" DROP CONSTRAINT "UQ_c6722fc568ad3e7386a8b81b246"`);
        await queryRunner.query(`ALTER TABLE "utility_cost" DROP COLUMN "expenseId"`);
        await queryRunner.query(`ALTER TABLE "personnel_cost" DROP CONSTRAINT "UQ_bf5317bc0626f1a1889adefc683"`);
        await queryRunner.query(`ALTER TABLE "personnel_cost" DROP COLUMN "expenseId"`);
        await queryRunner.query(`ALTER TABLE "operational-cost" ADD "date" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "operational-cost" ADD "value" numeric(12,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "supplies" ADD "total_cost" numeric(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "supplies" ADD "date" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "utility_cost" ADD "value" numeric(12,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "utility_cost" ADD "date" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "personnel_cost" ADD "value" numeric(12,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "personnel_cost" ADD "date" date NOT NULL`);
        await queryRunner.query(`DROP TABLE "expenses"`);
        await queryRunner.query(`DROP TYPE "public"."expenses_category_enum"`);
    }

}
