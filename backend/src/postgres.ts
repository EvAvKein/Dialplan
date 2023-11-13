import {readFileSync} from "fs";
import pg from "pg"; // can't destructure because it's commonjs

const postgres = new pg.Pool({
	host: "postgres",
	database: process.env.POSTGRES_USER,
	user: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
});
await postgres.connect().catch(() => console.log("Failed to connect to database"));

for (const fileName of ["org.sql", "inv.sql"]) {
	const fileContent = readFileSync("/backend/sql/" + fileName, "utf-8");
	postgres.query(fileContent).catch((error) => console.log(error));
}

export {postgres};
