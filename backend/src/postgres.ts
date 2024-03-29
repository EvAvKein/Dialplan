import {readFileSync} from "fs";
import pg from "pg"; // can't destructure because it's commonjs
import pgp from "pg-promise";

const maxConnectionAttempts = 3;
const pgConfig = {
	host: "postgres",
	database: process.env.POSTGRES_USER,
	user: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
} as const;

const postgres = new pg.Pool(pgConfig);

type pgpPool = pgp.IDatabase<{poolConfig: never}>;
const postgresP: pgpPool = pgp()(pgConfig);

for (let attempt = 1; attempt <= maxConnectionAttempts; attempt++) {
	// very first setup from the postgres docker image takes a bit. without these retries, the non-dev version ends up with a borked db connection & setup
	try {
		await postgres.connect();
		console.log(`Connected to Postgres ${attempt > 1 ? `(${attempt}/${maxConnectionAttempts} attempts)` : ""}`);
		break;
	} catch {
		await new Promise((resolve) => setTimeout(resolve, 3000));
	}

	if (attempt === maxConnectionAttempts) {
		throw new Error(`Failed to connect to Postgres (${attempt}/${maxConnectionAttempts} attempts)`);
	}
}

for (const fileName of ["org.sql", "inv.sql", "session.sql"]) {
	const fileContent = readFileSync("/backend/sql/" + fileName, "utf-8");
	await postgres.query(fileContent).catch((error) => console.log(error));
}

export {postgres, postgresP, type pgpPool};
