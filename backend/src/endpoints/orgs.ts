import {type Express} from "express";
import {type Pool} from "pg";
import {type pgpPool} from "../postgres.js";
import {fromZodError} from "zod-validation-error";
import {OrgAgentCreationDuo} from "../validation/org.js";
import {FetchResponse} from "../../../shared/objects/api.js";
import {Agent, Org} from "../../../shared/objects/org.js";

export function endpoints_orgs(app: Express, db: Pool, dbP: pgpPool) {
	app.post("/api/orgs", async (request, response) => {
		const validation = OrgAgentCreationDuo.safeParse(request.body);
		if (!validation.success) {
			response.status(400).json(new FetchResponse(null, {message: fromZodError(validation.error).message}));
			return;
		}

		const org = new Org(validation.data.org);
		const agent = new Agent(org.id, validation.data.agent);

		await dbP
			.tx(async (statement) => {
				await statement.none(
					`INSERT INTO Org
					(id, name, color, timezone)
					VALUES ($1, $2, $3, $4);`,
					[org.id, org.name, org.color, org.timezone],
				);
				await statement.none(
					`INSERT INTO Agent
					(id, orgId, name, department, countryCode, internals)
					VALUES ($1, $2, $3, $4, $5, $6)`,
					[agent.id, agent.orgId, agent.name, agent.department, agent.countryCode, agent.internals],
				);
			})
			.then(() => {
				response.status(200).end();
			})
			.catch((error) => {
				console.error("Org creation failure", error);
				response.status(500).json(new FetchResponse(null, {message: "Database error"}));
			});
	});
}
