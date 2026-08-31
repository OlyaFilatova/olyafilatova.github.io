import "reflect-metadata"
import { DataSource } from "typeorm"
import { Issue } from "./entities/issue.js"
import { Note } from "./entities/note.js"

import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { config } from "dotenv";

config({
  path: ".env",
});

const filename = fileURLToPath(import.meta.url);
const dir = dirname(filename);

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "test",
  password: process.env.DB_PASS || "test",
  database: process.env.DB_NAME || "test",
  entities: [Issue, Note],
  subscribers: [],
  migrations: [
    `${dir}/migrations/*.{js,ts}`,
  ],

  migrationsTableName: "typeorm_migrations",

  synchronize: false,
  logging: false,
  invalidWhereValuesBehavior: {
    null: 'throw',
    undefined: 'throw',
  },
})
