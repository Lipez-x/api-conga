import { MigrationInterface, QueryRunner } from "typeorm";

export class ProducerProductionRequest1763719084573 implements MigrationInterface {
    name = 'ProducerProductionRequest1763719084573'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."producer_production_request_status_enum" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED')`);
        await queryRunner.query(`CREATE TABLE "producer_production_request" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" date NOT NULL, "producer_name" text NOT NULL, "total_quantity" numeric(10,2) NOT NULL, "status" "public"."producer_production_request_status_enum" NOT NULL, CONSTRAINT "PK_6c629f6913bd86f8da9a4a0ff3b" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "producer_production_request"`);
        await queryRunner.query(`DROP TYPE "public"."producer_production_request_status_enum"`);
    }

}
