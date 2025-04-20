import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1745082901532 implements MigrationInterface {
    name = 'Init1745082901532'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "OrdersOutboxMessages" ADD "orderId" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "OrdersOutboxMessages" DROP COLUMN "orderId"`);
    }

}
