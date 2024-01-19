import {type Express} from "express";
import {type Pool} from "pg";
import {type Invite} from "../../../shared/objects/inv.js";
import {authAgent} from "../helpers/authUser.js";
import {FetchResponse} from "../../../shared/objects/api.js";

// import { type Pool } from "pg";
// import { type pgpPool } from "../postgres";

export function endpoints_invites(app: Express, db: Pool /*dbP: pgpPool*/) {
	app.get("/api/invites", async (request, response) => {
		// TODO: add functionality for getting all users in own org
		const agent = await authAgent(request);
		if (!agent) {
			response.status(400).json(new FetchResponse(null, {message: "User authentication failed"}));
			return;
		}

		await db
			.query<Invite>(
				`SELECT *
				FROM "Invite"
				WHERE "agentId" = $1
				ORDER BY "expiry" ASC`,
				[agent.id],
			)
			.then((dbResponse) => {
				response.status(200).json(new FetchResponse(dbResponse.rows));
			})
			.catch((error) => {
				console.error("Invite retrieval failure", error);
				response.status(500).json(new FetchResponse(null, {message: "Database error"}));
			});
	});
}
