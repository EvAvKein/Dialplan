import {type Express} from "express";
import {type Pool} from "pg";
import {authAgent} from "../helpers/authUser.js";
import {FetchResponse} from "../../../shared/objects/api.js";
import {Invite} from "../../../shared/objects/inv.js";
import {InviteCreationRequest} from "..//validation/inv.js";
import {fromZodError} from "zod-validation-error";

export function endpoints_invites(app: Express, db: Pool /*dbP: pgpPool*/) {
	app.post("/api/invites", async (request, response) => {
		const agent = await authAgent(request);
		if (!agent) {
			response.status(400).json(new FetchResponse(null, {message: "User authentication failed"}));
			return;
		}

		const validation = InviteCreationRequest.safeParse(request.body);
		if (!validation.success) {
			response.status(400).json(new FetchResponse(null, {message: fromZodError(validation.error).message}));
			return;
		}

		const invite = new Invite(validation.data, agent.id, agent.orgId);

		await db
			.query<Invite>(
				`INSERT INTO "Invite" ("id", "orgId", "agentId", "recipient", "callDuration", "expiry", "notes")
				VALUES ($1, $2, $3, $4, $5, $6, $7)`,
				[invite.id, invite.orgId, agent.id, invite.recipient, invite.callDuration, invite.expiry, invite.notes],
			)
			.then(() => {
				response.status(201).json(new FetchResponse(invite));
			})
			.catch((error) => {
				console.error("Invite creation failure", error);
				response.status(500).json(new FetchResponse(null, {message: "Database error"}));
			});
	});

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
