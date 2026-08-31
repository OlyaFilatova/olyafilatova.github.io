import type { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1788115107685 implements MigrationInterface {
    name = 'Initial1788115107685'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "issue" ("url" character varying NOT NULL, "links" jsonb NOT NULL, CONSTRAINT "PK_3c74f4e535d57d226dddf35f735" PRIMARY KEY ("url"))`);
        await queryRunner.query(`CREATE TABLE "note" ("id" SERIAL NOT NULL, "url" character varying NOT NULL, "note_en" character varying NOT NULL, "note_uk" character varying, "uk_approved" boolean NOT NULL, "visible" boolean NOT NULL, CONSTRAINT "PK_96d0c172a4fba276b1bbed43058" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "note"`);
        await queryRunner.query(`DROP TABLE "issue"`);
    }

}
