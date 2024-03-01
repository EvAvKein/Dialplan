import {apiFetch} from "./apiFetch";
import {FetchResponse} from "../../../shared/objects/api";

describe("apiFetch", () => {
	it("Handle thrown fetch error", async () => {
		global.fetch = jest.fn().mockRejectedValue(new Error("Failed to fetch"));

		const response = await apiFetch("GET", "/example");

		expect(response.data).toBeFalsy();
		expect(typeof response.error?.message).toBe("string");
		expect(response.status).toBeNull();
	});

	for (const method of ["GET", "POST", "PATCH", "DELETE"] as const) {
		it(`Correctly process ${method} request`, async () => {
			const address = "/example";
			const body = {name: "John Doe"};
			const returnData = "mocked data";

			global.fetch = jest.fn().mockResolvedValue({
				status: 200,
				text: jest.fn().mockResolvedValue(JSON.stringify({data: returnData})),
			});

			const response = await apiFetch(method, address, body);

			expect(fetch).toHaveBeenCalledWith("/api" + address, {
				headers: new Headers({
					"Content-Type": "application/json",
				}),
				method,
				body: JSON.stringify(body),
			});

			expect(response).toEqual({
				data: returnData,
				error: undefined,
				status: 200,
			});
		});
	}

	it("Forward custom status number", async () => {
		const customStatus = 246;

		global.fetch = jest.fn().mockResolvedValue({
			status: customStatus,
			text: jest.fn().mockResolvedValue(JSON.stringify({data: "wowee"})),
		});

		const response = await apiFetch("GET", "/example", {name: "John Doe"});

		expect(response.status).toEqual(customStatus);
	});

	it("Tolerate absent body", async () => {
		global.fetch = jest.fn().mockResolvedValue({
			status: 200,
			text: jest.fn().mockResolvedValue(""),
		});

		const response = await apiFetch("GET", "/example", {name: "John Doe"});

		expect(response).toEqual({
			error: undefined,
			data: undefined,
			status: 200,
		});
	});

	const generic1 = {data: 1} satisfies FetchResponse<number>;
	const generic2 = {data: "string"} satisfies FetchResponse<string>;
	const generic3 = {data: {nested: "object"}} satisfies FetchResponse<{nested: string}>;
	[generic1, generic2, generic3]; // to remove unused variable warning
});
