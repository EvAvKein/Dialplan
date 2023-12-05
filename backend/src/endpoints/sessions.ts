import {type Express} from "express";
import {type Pool} from "pg";
import {cookies as reqCookies} from "../../objects/cookies.js";
import {FetchResponse} from "../../../shared/objects/api.js";
import {Agent} from "../../../shared/objects/org.js";

export function endpoints_sessions(app: Express, db: Pool) {
	app.get("/api/sessions", async (request, response) => {
		const cookies: reqCookies = request.cookies;
		if (!cookies.dialplan_agentid || !cookies.dialplan_sessionid) {
			response.status(400).json(new FetchResponse(null, {message: "Missing authentication cookies"}));
			return;
		}

		await db
			.query<Agent>(
				`WITH "authSession" AS (
					SELECT *
					FROM "AgentSession"
					WHERE "sessionId" = $1 AND "agentId" = $2
					LIMIT 1
				)
				SELECT *
				FROM "AgentSession"
				WHERE "agentId" = "authSession"."agentId"
				LIMIT 1
				`,
				[],
			)
			.then(() => {
				response.status(200).end();
			})
			.catch((error) => {
				console.error("Org creation failure", error);
				response.status(500).json(new FetchResponse(null, {message: "Database error"}));
			});
	});
}
