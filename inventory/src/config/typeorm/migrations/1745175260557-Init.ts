import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1745175260557 implements MigrationInterface {
    name = 'Init1745175260557'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "InventoryRemoveInboxMessage" ("id" integer NOT NULL, CONSTRAINT "PK_fd5f8b5eb0a738860dee06fa795" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "InventoryRemoveOutboxMessage" ("orderId" integer NOT NULL, "successful" boolean NOT NULL, CONSTRAINT "PK_319e6c28176705d6bf371207ff8" PRIMARY KEY ("orderId"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "InventoryRemoveOutboxMessage"`);
        await queryRunner.query(`DROP TABLE "InventoryRemoveInboxMessage"`);
    }

}
