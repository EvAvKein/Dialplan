import {type Request} from "express";
import {type cookies} from "../../../shared/objects/cookies.js";
import {type Agent} from "../../objects/org.js";
import {postgres} from "../postgres.js";

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
