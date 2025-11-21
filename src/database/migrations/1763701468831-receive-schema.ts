import { MigrationInterface, QueryRunner } from "typeorm";

export class ReceiveSchema1763701468831 implements MigrationInterface {
    name = 'ReceiveSchema1763701468831'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "local_production" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" date NOT NULL, "gross_quantity" numeric(10,2) NOT NULL, "consumed_quantity" numeric(10,2) NOT NULL, "total_quantity" numeric(10,2) NOT NULL, "receiveId" uuid, CONSTRAINT "PK_fdd4986d7d48f9507f50efac80b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_bf2004a6b656a1929d5cad43e4" ON "local_production" ("date") `);
        await queryRunner.query(`CREATE TABLE "producer_production" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" date NOT NULL, "producer_name" text NOT NULL, "total_quantity" numeric(10,2) NOT NULL, "receiveId" uuid, CONSTRAINT "PK_97f18bfe9cc7545293d0655e1dd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_bcbd0f9c708715ea089ef8f4d1" ON "producer_production" ("date") `);
        await queryRunner.query(`CREATE TABLE "receives" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" date NOT NULL, "sale_price" numeric(12,2) NOT NULL, "tank_quantity" numeric(12,2) NOT NULL, "totalPrice" numeric(12,2) NOT NULL, CONSTRAINT "UQ_3d845cd567342a79d1375ac941b" UNIQUE ("date"), CONSTRAINT "PK_ba65825292d484986f79a3322bc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "local_production" ADD CONSTRAINT "FK_31ae8f4c818c45fa8cdc7fe1059" FOREIGN KEY ("receiveId") REFERENCES "receives"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "producer_production" ADD CONSTRAINT "FK_101cc436272970864cf018bc3be" FOREIGN KEY ("receiveId") REFERENCES "receives"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "producer_production" DROP CONSTRAINT "FK_101cc436272970864cf018bc3be"`);
        await queryRunner.query(`ALTER TABLE "local_production" DROP CONSTRAINT "FK_31ae8f4c818c45fa8cdc7fe1059"`);
        await queryRunner.query(`DROP TABLE "receives"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bcbd0f9c708715ea089ef8f4d1"`);
        await queryRunner.query(`DROP TABLE "producer_production"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bf2004a6b656a1929d5cad43e4"`);
        await queryRunner.query(`DROP TABLE "local_production"`);
    }

}
