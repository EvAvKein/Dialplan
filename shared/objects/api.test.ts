import {FetchResponse} from "./api.js";

describe("FetchResponse", () => {
	it("should create an instance with data and error", () => {
		const data = {name: "John Doe"};
		const error = {message: "Error occurred"};

		const response = new FetchResponse(data, error);

		expect(response.data).toEqual(data);
		expect(response.error).toEqual(error);
	});

	it("reate an instance with only data", () => {
		const data = {name: "John Doe"};

		const response = new FetchResponse(data);

		expect(response.data).toEqual(data);
		expect(Object.keys(response)).not.toContain("error");
	});

	it("create an instance with only error", () => {
		const error = {message: "Error occurred"};

		const response = new FetchResponse(undefined, error);

		expect(response.data).toBeUndefined();
		expect(response.error).toEqual(error);
	});

	it("create an instance with no data and no error", () => {
		const response = new FetchResponse();
		const keys = Object.keys(response);

		expect(keys).toHaveLength(0);
	});
});
