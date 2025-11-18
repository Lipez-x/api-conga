import { MigrationInterface, QueryRunner } from "typeorm";

export class ReceiveSchema1763447375192 implements MigrationInterface {
    name = 'ReceiveSchema1763447375192'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_bcbd0f9c708715ea089ef8f4d1"`);
        await queryRunner.query(`ALTER TABLE "producer_production" RENAME COLUMN "date" TO "dateDate"`);
        await queryRunner.query(`CREATE TABLE "receives" ("date" date NOT NULL, "sale_price" numeric(12,2) NOT NULL, "tank_quantity" numeric(12,2) NOT NULL, "totalPrice" numeric(12,2) NOT NULL, CONSTRAINT "PK_3d845cd567342a79d1375ac941b" PRIMARY KEY ("date"))`);
        await queryRunner.query(`ALTER TABLE "local_production" ALTER COLUMN "date" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "producer_production" ALTER COLUMN "dateDate" DROP NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_edd8879d05ae164e919b7b5adb" ON "producer_production" ("dateDate") `);
        await queryRunner.query(`ALTER TABLE "local_production" ADD CONSTRAINT "FK_bf2004a6b656a1929d5cad43e4c" FOREIGN KEY ("date") REFERENCES "receives"("date") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "producer_production" ADD CONSTRAINT "FK_edd8879d05ae164e919b7b5adba" FOREIGN KEY ("dateDate") REFERENCES "receives"("date") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "producer_production" DROP CONSTRAINT "FK_edd8879d05ae164e919b7b5adba"`);
        await queryRunner.query(`ALTER TABLE "local_production" DROP CONSTRAINT "FK_bf2004a6b656a1929d5cad43e4c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_edd8879d05ae164e919b7b5adb"`);
        await queryRunner.query(`ALTER TABLE "producer_production" ALTER COLUMN "dateDate" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "local_production" ALTER COLUMN "date" SET NOT NULL`);
        await queryRunner.query(`DROP TABLE "receives"`);
        await queryRunner.query(`ALTER TABLE "producer_production" RENAME COLUMN "dateDate" TO "date"`);
        await queryRunner.query(`CREATE INDEX "IDX_bcbd0f9c708715ea089ef8f4d1" ON "producer_production" ("date") `);
    }

}
