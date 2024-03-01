import {newSessionId} from "./newSessionId.js";

it("Generate a new session ID", () => {
	const id = newSessionId();

	expect(id.length).toBeGreaterThan(15);
	expect(id).not.toMatch(/ /g);
});

it("Generate a unique session ID", () => {
	// "unique" is an overstatement, but this test seems reasonable enough
	const idSamples = Array(250)
		.fill(null)
		.map(() => newSessionId());

	const newId = newSessionId();

	expect(idSamples).not.toContain(newId);
});
