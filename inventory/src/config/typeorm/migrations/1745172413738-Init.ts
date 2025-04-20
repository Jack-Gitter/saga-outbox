import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1745172413738 implements MigrationInterface {
    name = 'Init1745172413738'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "inventory_reservation" ("id" SERIAL NOT NULL, "orderId" integer NOT NULL, "product" integer NOT NULL, "quantity" integer NOT NULL, CONSTRAINT "PK_2cb77f4395cf5f8071fa59ec075" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "InventoryReserveInboxMessage" ("id" integer NOT NULL, CONSTRAINT "PK_89aedc782b98d7adfc06b5e9949" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "InventoryReserveOutboxMessage" ("orderId" integer NOT NULL, "successful" boolean NOT NULL, CONSTRAINT "PK_f509a6667150d13fe83003654d2" PRIMARY KEY ("orderId"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "InventoryReserveOutboxMessage"`);
        await queryRunner.query(`DROP TABLE "InventoryReserveInboxMessage"`);
        await queryRunner.query(`DROP TABLE "inventory_reservation"`);
    }

}
