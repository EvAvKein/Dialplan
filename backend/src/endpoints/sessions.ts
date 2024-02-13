import {type Express} from "express";
import {type Pool} from "pg";
import {type cookies, cookieKeys} from "../../../shared/objects/cookies.js";
import {type Agent} from "../../../shared/objects/org.js";
import {FetchResponse} from "../../../shared/objects/api.js";
import {newSessionId} from "../helpers/newSessionId.js";
import {tempSignInData} from "../validation/org.js";
import {fromZodError} from "zod-validation-error";

export function endpoints_sessions(app: Express, db: Pool) {
	app.post("/api/sessions", async (request, response) => {
		const signInData = tempSignInData.safeParse(request.body);
		if (!signInData.success) {
			response.status(400).json(new FetchResponse(null, {message: fromZodError(signInData.error).message}));
			return;
		}

		const sessionId = newSessionId();

		await db
			.query<Agent>(
				`WITH agent AS (
					SELECT "id"
					FROM "Agents"
					WHERE "id" = $1 AND "orgId" = $2
				)
				INSERT INTO "AgentSessions"
				("id", "agentId")
				VALUES $3, agent."id";
				`,
				[signInData.data.agentId, signInData.data.orgId, sessionId],
			)
			.then(() => {
				response.status(201).cookie(cookieKeys.sessionid, sessionId).end();
			})
			.catch((error) => {
				console.error("Session creation failure", error);
				response.status(500).json(new FetchResponse(null, {message: "Database error"}));
			});
	});

	app.delete("/api/sessions", async (request, response) => {
		const reqCookies: cookies = request.cookies;
		if (!reqCookies.dialplan_sessionid) {
			response.status(400).json(new FetchResponse(null, {message: "Missing authentication cookies"}));
			return;
		}

		await db
			.query<Agent>(
				`DELETE
				FROM "AgentSession"
				WHERE "id" = $1
				`,
				[reqCookies.dialplan_sessionid],
			)
			.then(() => {
				response.status(200).clearCookie(cookieKeys.sessionid).end();
			})
			.catch((error) => {
				console.error("Session deletion failure", error);
				response.status(500).json(new FetchResponse(null, {message: "Database error"}));
			});
	});
}
