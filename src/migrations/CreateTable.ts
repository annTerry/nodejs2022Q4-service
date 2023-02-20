import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTable1676913706854 implements MigrationInterface {
  name = '1676913706854-CreateTable';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" character varying NOT NULL, "login" character varying NOT NULL, "password" character varying NOT NULL, "version" integer NOT NULL, "createdAt" bigint NOT NULL, "updatedAt" bigint NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "artist" ("id" character varying NOT NULL, "name" character varying NOT NULL, "grammy" boolean NOT NULL, CONSTRAINT "PK_55b76e71568b5db4d01d3e394ed" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "album" ("id" character varying NOT NULL, "name" character varying NOT NULL, "year" integer NOT NULL, "artistIdId" character varying, CONSTRAINT "PK_58e0b4b8a31bb897e6959fe3206" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "track" ("id" character varying NOT NULL, "name" character varying NOT NULL, "duration" integer NOT NULL, "artistIdId" character varying, "albumIdId" character varying, CONSTRAINT "PK_0631b9bcf521f8fab3a15f2c37e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "favorites" ("id" character varying NOT NULL, "type" character varying NOT NULL, CONSTRAINT "PK_890818d27523748dd36a4d1bdc8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "album" ADD CONSTRAINT "FK_741ddfe3b22f018084c7d9f9574" FOREIGN KEY ("artistIdId") REFERENCES "artist"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "track" ADD CONSTRAINT "FK_817e387c7bc65ab2ecb08f66d7f" FOREIGN KEY ("artistIdId") REFERENCES "artist"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "track" ADD CONSTRAINT "FK_e259e7f86606390730993b2a5a5" FOREIGN KEY ("albumIdId") REFERENCES "album"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "track" DROP CONSTRAINT "FK_e259e7f86606390730993b2a5a5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "track" DROP CONSTRAINT "FK_817e387c7bc65ab2ecb08f66d7f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "album" DROP CONSTRAINT "FK_741ddfe3b22f018084c7d9f9574"`,
    );
    await queryRunner.query(`DROP TABLE "favorites"`);
    await queryRunner.query(`DROP TABLE "track"`);
    await queryRunner.query(`DROP TABLE "album"`);
    await queryRunner.query(`DROP TABLE "artist"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
