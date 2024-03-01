import {unix, iso} from "./timestamps.js";

describe("unix", () => {
	it("Return current timestamp in seconds", () => {
		const expected = Math.floor(Date.now() / 1000);
		const result = unix();
		expect(result).toBe(expected);
	});

	it("Return timestamp in seconds by date object", () => {
		const date = new Date("2022-01-01T00:00:00Z");
		const expected = Math.floor(date.getTime() / 1000);
		const result = unix(date);
		expect(result).toBe(expected);
	});

	it("Return timestamp in seconds by date string", () => {
		const dateString = "2022-01-01T00:00:00Z";
		const date = new Date(dateString);
		const expected = Math.floor(date.getTime() / 1000);
		const result = unix(dateString);
		expect(result).toBe(expected);
	});
});

describe("iso", () => {
	it("Return current timestamp in ISO format", () => {
		const date = new Date();
		date.setMilliseconds(0);
		const expected = date.toISOString();
		const result = iso();
		expect(result).toBe(expected);
	});

	it("Return timestamp in ISO format by date object", () => {
		const date = new Date("2022-01-01T00:00:00Z");
		const expected = date.toISOString();
		const result = iso(date);
		expect(result).toBe(expected);
	});

	it("Return timestamp in ISO format by date string", () => {
		const dateString = "2022-01-01T00:00:00Z";
		const date = new Date(dateString);
		const expected = date.toISOString();
		const result = iso(dateString);
		expect(result).toBe(expected);
	});
});
