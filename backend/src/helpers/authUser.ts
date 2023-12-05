import {Request} from "express";
import {cookies} from "../../../shared/objects/cookies.js";
import {postgres} from "../postgres.js";
import {Agent} from "../../objects/org.js";

export async function authAgent(request: Request) {
	const cookies: cookies = request.cookies;

	if (!cookies.dialplan_agentid || !cookies.dialplan_sessionid) {
		return null;
	}

	const dbResponse = await postgres.query<Agent>(
		`SELECT *
		FROM "Agent"
		WHERE "id" IN (
			SELECT "agentId"
			FROM "AgentSession"
			WHERE "id" = $1 AND "agentId" = $2
		)
		LIMIT 1`,
		[cookies.dialplan_sessionid, cookies.dialplan_agentid],
	);

	return dbResponse.rows[0];
}
