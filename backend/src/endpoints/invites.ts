import {type Express} from "express";
import {type Pool} from "pg";
import {authUser} from "../helpers/authUser.js";
import {FetchResponse} from "../../../shared/objects/api.js";
import {Invite, InvitePayload} from "../../../shared/objects/inv.js";
import {InviteCreationRequest} from "..//validation/inv.js";
import {fromZodError} from "zod-validation-error";
import {Agent, Org} from "../../../shared/objects/org.js";

export function endpoints_invites(app: Express, db: Pool /*dbP: pgpPool*/) {
	app.post("/api/invites", async (request, response) => {
		const agent = await authUser(request);
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
		const agent = await authUser(request);
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

	// TODO: come up with a RESTful route considering the output. append a param probably?
	app.get("/api/invites/:id", async (request, response) => {
		const {id} = request.params;

		if (!id) {
			response.status(400).json(new FetchResponse(null, {message: "Received no invite ID"}));
			return;
		}

		// TODO: consolidate these 3 queries into one, requires some column "AS"s and converting the output to InvitePayload

		const invite = await db
			.query<Invite>(
				`SELECT *
					FROM "Invite"
					WHERE "id" = $1
					LIMIT 1`,
				[id],
			)
			.then((res) => res.rows[0])
			.catch((err) => {
				console.error("Invite-by-id retrieval failure", err);
				response.status(500).json(new FetchResponse(null, {message: "Database error"}));
			});

		if (!invite) {
			if (!response.headersSent) response.status(400).json(new FetchResponse(null, {message: "Invite not found"}));
			return;
		}

		// yup, these `await`s are bad; `Promise.all()` would be better, consolidating the queries would be best (see above comment)
		const org = await db
			.query<Org>(
				`SELECT *
				FROM "Org"
				WHERE "id" = $1
				LIMIT 1`,
				[invite.orgId],
			)
			.then((res) => res.rows[0])
			.catch((err) => {
				console.error("Org-by-inv-id retrieval failure", err);
				response.status(500).json(new FetchResponse(null, {message: "Database error"}));
			});
		const agent = await db
			.query<Agent>(
				`SELECT *
				FROM "Agent"
				WHERE "id" = $1
				LIMIT 1`,
				[invite.agentId],
			)
			.then((res) => res.rows[0])
			.catch((err) => {
				console.error("Org-by-inv-id retrieval failure", err);
				response.status(500).json(new FetchResponse(null, {message: "Database error"}));
			});

		if (!org || !agent) {
			if (!response.headersSent) response.status(400).json(new FetchResponse(null, {message: "Invite not found"}));
			return;
		}

		const data = new InvitePayload(invite, org, agent);
		response.status(200).json(new FetchResponse(data));
	});
}
