import {type Express} from "express";
import {type Pool} from "pg";
import {type pgpPool} from "../postgres.js";
import {fromZodError} from "zod-validation-error";
import {OrgAgentCreationDuo} from "../validation/org.js";
import {FetchResponse} from "../../../shared/objects/api.js";
import {Agent, Org} from "../../../shared/objects/org.js";
import {v4 as uuid} from "uuid";
import {authAgent} from "../helpers/authUser.js";

export function endpoints_orgs(app: Express, db: Pool, dbP: pgpPool) {
	app.post("/api/orgs", async (request, response) => {
		const validation = OrgAgentCreationDuo.safeParse(request.body);
		if (!validation.success) {
			response.status(400).json(new FetchResponse(null, {message: fromZodError(validation.error).message}));
			return;
		}

		const org = new Org(validation.data.org);
		const agent = new Agent(org.id, validation.data.agent);
		const sessionId = uuid();

		await dbP
			.tx(async (statement) => {
				await statement.none(
					`INSERT INTO "Org"
					("id", "name", "color")
					VALUES ($1, $2, $3);`,
					[org.id, org.name, org.color],
				);
				await statement.none(
					`INSERT INTO "Agent"
					("id", "orgId", "name", "department", "countryCode", "timezone", "internals")
					VALUES ($1, $2, $3, $4, $5, $6, $7)`,
					[agent.id, agent.orgId, agent.name, agent.department, agent.countryCode, agent.timezone, agent.internals],
				);
				await statement.none(
					`INSERT INTO "AgentSession"
					("id", "agentId")
					VALUES ($1, $2);`,
					[sessionId, agent.id],
				);
			})
			.then(() => {
				response
					.status(201)
					.cookie("dialplan_agentid", agent.id, {secure: true})
					.cookie("dialplan_sessionid", sessionId, {secure: true})
					.end();
			})
			.catch((error) => {
				console.error("Org creation failure", error);
				response.status(500).json(new FetchResponse(null, {message: "Database error"}));
			});
	});

	app.get("/api/orgs", async (request, response) => {
		const agent = await authAgent(request);
		if (!agent) {
			response.status(400).json(new FetchResponse(null, {message: "User authentication failed"}));
			return;
		}

		await db
			.query<Org>(
				`SELECT *
				FROM "Org"
				WHERE "id" = $1
				LIMIT 1
				`,
				[agent.orgId],
			)
			.then((value) => {
				value.rowCount
					? response.status(200).json(new FetchResponse(value.rows[0]))
					: response.status(400).json(new FetchResponse(null, {message: "Org not found"}));
			})
			.catch((error) => {
				console.error("Session GET failure", error);
				response.status(500).json(new FetchResponse(null, {message: "Database error"}));
			});
	});
}
