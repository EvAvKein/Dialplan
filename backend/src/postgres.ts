import {readFileSync} from "fs";
import dotenv from "dotenv";
import pg from "pg"; // can't destructure because it's commonjs
import pgp from "pg-promise";
dotenv.config({path: "/backend/.env"}); // somehow unnecessary on my local machine, but needed in CI

console.log(readFileSync("/backend/.env", "utf-8"));
console.log(process.env);

const maxConnectionAttempts = process.env.CI ? 25 : 5;
const pgConfig = {
	host: "postgres",
	database: process.env.POSTGRES_USER,
	user: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
} as const;

const postgres = new pg.Pool(pgConfig);
for (let attempt = 1; attempt <= maxConnectionAttempts; attempt++) {
	// very first setup from the postgres docker image takes a bit. without these retries, the non-dev version ends up with a borked db connection & setup
	// TODO: improve readability
	try {
		await postgres.connect();
		console.log(`Connected to postgres (${attempt}/${maxConnectionAttempts} attempts)`);
		break;
	} catch {
		await new Promise((resolve) => setTimeout(resolve, 3000));
	}

	if (attempt === maxConnectionAttempts) {
		throw new Error(`Failed to connect to postgres (${attempt}/${maxConnectionAttempts} attempts)`);
	}
}

type pgpPool = pgp.IDatabase<{poolConfig: never}>;
const postgresP: pgpPool = pgp()(pgConfig);

for (const fileName of ["org.sql", "inv.sql", "session.sql"]) {
	const fileContent = readFileSync("/backend/sql/" + fileName, "utf-8");
	await postgres.query(fileContent).catch((error) => console.log(error));
}

export {postgres, postgresP, type pgpPool};
