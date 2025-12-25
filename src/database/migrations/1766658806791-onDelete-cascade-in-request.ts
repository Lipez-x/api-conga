import { MigrationInterface, QueryRunner } from "typeorm";

export class OnDeleteCascadeInRequest1766658806791 implements MigrationInterface {
    name = 'OnDeleteCascadeInRequest1766658806791'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "producer_production_request" DROP CONSTRAINT "FK_8b040a9c1d653d1ed2d5edb4079"`);
        await queryRunner.query(`ALTER TABLE "producer_production_request" ADD CONSTRAINT "FK_8b040a9c1d653d1ed2d5edb4079" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "producer_production_request" DROP CONSTRAINT "FK_8b040a9c1d653d1ed2d5edb4079"`);
        await queryRunner.query(`ALTER TABLE "producer_production_request" ADD CONSTRAINT "FK_8b040a9c1d653d1ed2d5edb4079" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
