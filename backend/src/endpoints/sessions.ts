import {type Express} from "express";
import {type Pool} from "pg";
import {type cookies, cookieKeys} from "../../../shared/objects/cookies.js";
import {FetchResponse} from "../../../shared/objects/api.js";
import {Agent} from "../../../shared/objects/org.js";

export function endpoints_sessions(app: Express, db: Pool) {
	app.delete("/api/sessions", async (request, response) => {
		const reqCookies: cookies = request.cookies;
		if (!reqCookies.dialplan_agentid || !reqCookies.dialplan_sessionid) {
			response.status(400).json(new FetchResponse(null, {message: "Missing authentication cookies"}));
			return;
		}

		await db
			.query<Agent>(
				`DELETE
				FROM "AgentSession"
				WHERE "id" = $1 AND "agentId" = $2
				`,
				[reqCookies.dialplan_sessionid, reqCookies.dialplan_agentid],
			)
			.then(() => {
				response.status(200).clearCookie(cookieKeys.sessionid).clearCookie(cookieKeys.agentid).end();
			})
			.catch((error) => {
				console.error("Session deletion failure", error);
				response.status(500).json(new FetchResponse(null, {message: "Database error"}));
			});
	});
}
