import {readFileSync} from "fs";
import pg from "pg"; // can't destructure because it's commonjs
import pgp from "pg-promise";

const pgConfig = {
	host: "postgres",
	database: process.env.POSTGRES_USER,
	user: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
} as const;

const postgres = new pg.Pool(pgConfig);
await postgres.connect().catch(() => console.log("Failed to connect to database"));
type pgpPool = pgp.IDatabase<{poolConfig: never}>;
const postgresP: pgpPool = pgp()(pgConfig);

for (const fileName of ["org.sql", "inv.sql"]) {
	const fileContent = readFileSync("/backend/sql/" + fileName, "utf-8");
	postgres.query(fileContent).catch((error) => console.log(error));
}

export {postgres, postgresP, type pgpPool};
