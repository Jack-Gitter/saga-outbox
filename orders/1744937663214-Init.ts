import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1744937663214 implements MigrationInterface {
    name = 'Init1744937663214'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."Orders_status_enum" AS ENUM('PENDING', 'CANCELED', 'REJECTED', 'CONFIRMED')`);
        await queryRunner.query(`CREATE TABLE "Orders" ("id" SERIAL NOT NULL, "product" integer NOT NULL, "quantity" integer NOT NULL, "status" "public"."Orders_status_enum" NOT NULL DEFAULT 'PENDING', CONSTRAINT "PK_ce8e3c4d56e47ff9c8189c26213" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "OrdersOutboxMessages" ("id" SERIAL NOT NULL, "product" integer NOT NULL, "quantity" integer NOT NULL, CONSTRAINT "PK_e4353c28141f6209c802f8734fa" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "OrdersOutboxMessages"`);
        await queryRunner.query(`DROP TABLE "Orders"`);
        await queryRunner.query(`DROP TYPE "public"."Orders_status_enum"`);
    }

}
