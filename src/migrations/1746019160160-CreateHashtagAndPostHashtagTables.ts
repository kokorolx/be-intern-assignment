import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateHashtagAndPostHashtagTables1746019160160 implements MigrationInterface {
    name = 'CreateHashtagAndPostHashtagTables1746019160160'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "hashtags" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "tag" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_0b4ef8e83392129fb3373fdb3af" UNIQUE ("tag"))`);
        await queryRunner.query(`CREATE TABLE "posts_hashtags_hashtags" ("postsId" integer NOT NULL, "hashtagsId" integer NOT NULL, PRIMARY KEY ("postsId", "hashtagsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c52d9ed78d930e7dc28c5a93cf" ON "posts_hashtags_hashtags" ("postsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4664ee7d5459af42a58502b413" ON "posts_hashtags_hashtags" ("hashtagsId") `);
        await queryRunner.query(`DROP INDEX "IDX_c52d9ed78d930e7dc28c5a93cf"`);
        await queryRunner.query(`DROP INDEX "IDX_4664ee7d5459af42a58502b413"`);
        await queryRunner.query(`CREATE TABLE "temporary_posts_hashtags_hashtags" ("postsId" integer NOT NULL, "hashtagsId" integer NOT NULL, CONSTRAINT "FK_c52d9ed78d930e7dc28c5a93cff" FOREIGN KEY ("postsId") REFERENCES "posts" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_4664ee7d5459af42a58502b4139" FOREIGN KEY ("hashtagsId") REFERENCES "hashtags" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("postsId", "hashtagsId"))`);
        await queryRunner.query(`INSERT INTO "temporary_posts_hashtags_hashtags"("postsId", "hashtagsId") SELECT "postsId", "hashtagsId" FROM "posts_hashtags_hashtags"`);
        await queryRunner.query(`DROP TABLE "posts_hashtags_hashtags"`);
        await queryRunner.query(`ALTER TABLE "temporary_posts_hashtags_hashtags" RENAME TO "posts_hashtags_hashtags"`);
        await queryRunner.query(`CREATE INDEX "IDX_c52d9ed78d930e7dc28c5a93cf" ON "posts_hashtags_hashtags" ("postsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4664ee7d5459af42a58502b413" ON "posts_hashtags_hashtags" ("hashtagsId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_4664ee7d5459af42a58502b413"`);
        await queryRunner.query(`DROP INDEX "IDX_c52d9ed78d930e7dc28c5a93cf"`);
        await queryRunner.query(`ALTER TABLE "posts_hashtags_hashtags" RENAME TO "temporary_posts_hashtags_hashtags"`);
        await queryRunner.query(`CREATE TABLE "posts_hashtags_hashtags" ("postsId" integer NOT NULL, "hashtagsId" integer NOT NULL, PRIMARY KEY ("postsId", "hashtagsId"))`);
        await queryRunner.query(`INSERT INTO "posts_hashtags_hashtags"("postsId", "hashtagsId") SELECT "postsId", "hashtagsId" FROM "temporary_posts_hashtags_hashtags"`);
        await queryRunner.query(`DROP TABLE "temporary_posts_hashtags_hashtags"`);
        await queryRunner.query(`CREATE INDEX "IDX_4664ee7d5459af42a58502b413" ON "posts_hashtags_hashtags" ("hashtagsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c52d9ed78d930e7dc28c5a93cf" ON "posts_hashtags_hashtags" ("postsId") `);
        await queryRunner.query(`DROP INDEX "IDX_4664ee7d5459af42a58502b413"`);
        await queryRunner.query(`DROP INDEX "IDX_c52d9ed78d930e7dc28c5a93cf"`);
        await queryRunner.query(`DROP TABLE "posts_hashtags_hashtags"`);
        await queryRunner.query(`DROP TABLE "hashtags"`);
    }

}
