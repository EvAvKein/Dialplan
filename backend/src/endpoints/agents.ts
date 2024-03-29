import {type Express} from "express";
import {authUser} from "../helpers/authUser.js";
import {FetchResponse} from "../../../shared/objects/api.js";
// import { type Pool } from "pg";
// import { type pgpPool } from "../postgres";

export function endpoints_agents(app: Express /*db: Pool, dbP: pgpPool*/) {
	app.get("/api/agents", async (request, response) => {
		// TODO: add functionality for getting all users in own org
		const agent = await authUser(request);
		agent
			? response.status(200).json(new FetchResponse(agent))
			: response.status(400).json(new FetchResponse(null, {message: "User authentication failed"}));
	});
}
