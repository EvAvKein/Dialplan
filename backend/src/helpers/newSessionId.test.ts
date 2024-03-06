import {newSessionId} from "./newSessionId.js";

it("Generate a new session ID", () => {
	const id = newSessionId();

	expect(id.length).toBeGreaterThan(15);
	expect(id).not.toMatch(/ /g);
});

it("Generate unique session IDs", () => {
	// "unique" is an overstatement, but this test seems reasonable enough
	const ids = Array(250)
		.fill(null)
		.map(() => newSessionId());

	const idsSet = new Set(ids);

	expect(idsSet.size).toBe(ids.length);
});
