import {type Request} from "express";
import {expressRequest} from "./mocks/expressRequest.js";
import {postgres} from "../postgres.js";
import {authUser} from "./authUser.js";

jest.mock("../postgres", () => {
	return {
		postgres: {
			query: jest.fn(),
		},
	};
});

describe("authUser", () => {
	it("Return null if cookies are not present", async () => {
		const request: Request = expressRequest({cookies: {}});

		postgres.query = jest.fn().mockResolvedValue({
			rows: [{id: 1, name: "John Doe"}],
		});

		const result = await authUser(request);

		expect(postgres.query).not.toHaveBeenCalled();
		expect(result).toBeNull();
	});

	it("Return the first Agent from the database response", async () => {
		const request = expressRequest({
			cookies: {
				dialplan_sessionid: "session_id",
			},
		});

		postgres.query = jest.fn().mockResolvedValue({
			rows: [{id: 1, name: "John Doe"}],
		});

		const result = await authUser(request);

		expect(postgres.query).toHaveBeenCalled();
		expect(result).toEqual({id: 1, name: "John Doe"});
	});

	it("Return null if the database response is empty", async () => {
		const request = expressRequest({
			cookies: {
				dialplan_sessionid: "session_id",
			},
		});

		postgres.query = jest.fn().mockResolvedValue({
			rows: [],
		});

		const result = await authUser(request);

		expect(postgres.query).toHaveBeenCalled();
		expect(result).toBeNull();
	});
});
