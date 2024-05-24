import {recursiveRecord} from "../../../shared/helpers/dataRecord";
import {InputState, recursiveInputStateRecordIsValid, recursiveInputStateRecordToValues} from "./inputState";

describe("InputState", () => {
	it("Initial state set correctly", () => {
		const state1 = new InputState("Initial", /^[A-Za-z]+$/);
		expect(state1.value).toEqual("Initial");
		expect(state1.attempted).toEqual(false);
		expect(state1.valid).toEqual(false);
		expect(String(state1.pattern)).toEqual(String(/^[A-Za-z]+$/));
		expect(state1.charLimit).toEqual(null);

		const state2 = new InputState("Initial2", /^[A-Zz]+$/, 20);
		expect(state2.value).toEqual("Initial2");
		expect(state2.attempted).toEqual(false);
		expect(state2.valid).toEqual(false);
		expect(String(state2.pattern)).toEqual(String(/^[A-Zz]+$/));
		expect(state2.charLimit).toEqual(20);

		const state3 = new InputState("Initial3", /^[Az]+$/, 20, true);
		expect(state3.value).toEqual("Initial3");
		expect(state3.attempted).toEqual(false);
		expect(state3.valid).toEqual(true);
		expect(String(state3.pattern)).toEqual(String(/^[Az]+$/));
		expect(state3.charLimit).toEqual(20);
	});

	it("Update value and attempted", () => {
		const state = new InputState("", /^[A-Za-z]+$/, 10);
		state.set("Hello");
		expect(state.value).toEqual("Hello");
		expect(state.attempted).toEqual(true);
	});

	it("Trim method returns correctly", () => {
		const state1 = new InputState("", /^[A-Za-z]+$/, 6);
		const trimmed1 = state1.trimByLimit("Hello World");
		expect(trimmed1).toEqual("Hello ");

		const state2 = new InputState("", /^[A-Za-z]+$/);
		const trimmed2 = state2.trimByLimit("Hello World");
		expect(trimmed2).toEqual("Hello World");
	});
	it("'trimByLimit' method returns correct result", () => {
		const state1 = new InputState("", /\\*/, 10);
		state1.set("Hello World");
		expect(state1.value).toEqual("Hello Worl");

		const state2 = new InputState("", /\\*/);
		state2.set("Hello World");
		expect(state2.value).toEqual("Hello World");
	});

	it("'Test' method returns correct result", () => {
		const state1 = new InputState("", /^[A-Za-z]+$/, 5);
		expect(state1.test("Hello")).toEqual(true);

		const state2 = new InputState("", /^[A-Za-z]+$/, 5);
		expect(state2.test("12345")).toEqual(false);

		const state3 = new InputState("", /^[A-Za-z]+$/, 5);
		expect(state3.test("HelloHello")).toEqual(false);
	});
	it("Update valid state correctly", () => {
		const state1 = new InputState("", /^[A-Za-z]+$/, 10, false);
		state1.set("Hello");
		expect(state1.value).toEqual("Hello");
		expect(state1.attempted).toEqual(true);
		expect(state1.valid).toEqual(true);

		const state2 = new InputState("", /^[A-Za-z]+$/, 10);
		state2.set("Hell0");
		expect(state2.value).toEqual("Hell0");
		expect(state2.attempted).toEqual(true);
		expect(state2.valid).toEqual(false);

		const state3 = new InputState("", /^[A-Za-z]+$/, 4);
		state3.set("Hello");
		expect(state3.value).toEqual("Hell");
		expect(state3.attempted).toEqual(true);
		expect(state3.valid).toEqual(true);
	});
});

type recursiveTestObj = {
	key1: string;
	key2: {
		subKey1: string;
		subKey2: {
			subSubKey: string;
		};
	};
};
type recursiveInputStateTestObj = recursiveRecord<recursiveTestObj, InputState>;

it("recursiveInputStateRecordToValues", () => {
	const inputState1 = new InputState("Hello", /^[A-Za-z]+$/);
	const inputState2 = new InputState("12345", /^[0-9]+$/);
	const inputState3 = new InputState("World", /^[A-Za-z0-9]+$/);

	const record: recursiveRecord<recursiveTestObj, InputState> = {
		key1: inputState1,
		key2: {
			subKey1: inputState2,
			subKey2: {
				subSubKey: inputState3,
			},
		},
	};
	const expected: recursiveRecord<recursiveTestObj, string> = {
		key1: inputState1.value,
		key2: {
			subKey1: inputState2.value,
			subKey2: {
				subSubKey: inputState3.value,
			},
		},
	};

	const result = recursiveInputStateRecordToValues(record);
	expect(result).toEqual(expected);
});

describe("recursiveInputStateRecordIsValid", () => {
	it("recursiveInputStateRecordIsValid returns true only if all are valid", () => {
		expect(
			recursiveInputStateRecordIsValid({
				key1: new InputState("Hello", /^[A-Za-z]+$/),
				key2: {
					subKey1: new InputState("12345", /^[0-9]+$/),
					subKey2: {
						subSubKey: new InputState("World", /^[A-Za-z]+$/),
					},
				},
			} satisfies recursiveInputStateTestObj),
		).toEqual(false);

		expect(
			recursiveInputStateRecordIsValid({
				key1: new InputState("Hello", /^[A-Za-z]+$/, null, true),
				key2: {
					subKey1: new InputState("12345", /^[0-9]+$/, 10, true),
					subKey2: {
						subSubKey: new InputState("World", /^[A-Za-z]+$/),
					},
				},
			} satisfies recursiveInputStateTestObj),
		).toEqual(false);

		expect(
			recursiveInputStateRecordIsValid({
				key1: new InputState("Hello", /^[A-Za-z]+$/, null, true),
				key2: {
					subKey1: new InputState("12345", /^[0-9]+$/, 10, true),
					subKey2: {
						subSubKey: new InputState("World", /^[A-Za-z]+$/, null, true),
					},
				},
			} satisfies recursiveInputStateTestObj),
		).toEqual(true);

		expect(
			recursiveInputStateRecordIsValid({
				key1: new InputState("Hello", /^[A-Za-z]+$/, null, true),
				key2: {
					subKey1: "non-InputState value",
					subKey2: {
						subSubKey: new InputState("World", /^[A-Za-z]+$/, null, true),
					},
				},
			}),
		).toEqual(true);
	});
});
