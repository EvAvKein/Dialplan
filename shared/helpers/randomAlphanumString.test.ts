import {randomAlphanumString} from "./randomAlphanumString.js";

describe("randomAlphanumString", () => {
	it("Generate an alphanumeric string of the specified length", () => {
		for (const length of [5, 47, 132]) {
			const result = randomAlphanumString(length);
			expect(result).toHaveLength(length);
			expect(result).toMatch(/[a-zA-Z]/);
			expect(result).toMatch(/[0-9]/);
		}
	});

	it("Return non-identical strings", () => {
		const strings = Array(250)
			.fill(null)
			.map(() => randomAlphanumString(50));

		const stringsSet = new Set(strings);

		expect(stringsSet.size).toBe(strings.length);
	});

	it("Return an empty string when length is 0", () => {
		const length = 0;
		const result = randomAlphanumString(length);
		expect(result).toBe("");
	});

	it("Return an empty string when length is negative", () => {
		const length = -5;
		const result = randomAlphanumString(length);
		expect(result).toBe("");
	});
});
