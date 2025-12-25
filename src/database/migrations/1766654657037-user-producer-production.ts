import { MigrationInterface, QueryRunner } from "typeorm";

export class UserProducerProduction1766654657037 implements MigrationInterface {
    name = 'UserProducerProduction1766654657037'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "producer_production" ADD "createdBy" uuid`);
        await queryRunner.query(`ALTER TABLE "producer_production_request" ADD "createdBy" uuid`);
        await queryRunner.query(`ALTER TABLE "producer_production" ADD CONSTRAINT "FK_42354f46f109b05c2306698c05d" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "producer_production_request" ADD CONSTRAINT "FK_8b040a9c1d653d1ed2d5edb4079" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "producer_production_request" DROP CONSTRAINT "FK_8b040a9c1d653d1ed2d5edb4079"`);
        await queryRunner.query(`ALTER TABLE "producer_production" DROP CONSTRAINT "FK_42354f46f109b05c2306698c05d"`);
        await queryRunner.query(`ALTER TABLE "producer_production_request" DROP COLUMN "createdBy"`);
        await queryRunner.query(`ALTER TABLE "producer_production" DROP COLUMN "createdBy"`);
    }

}
