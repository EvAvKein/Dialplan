import {type Org, type Agent} from "../../shared/objects/org";
import {randomAlphanumString} from "./randomAlphanumString";

type dataset<T, K extends keyof T = keyof T> = [T[K], T[K], T[K], T[K]];

type validityDataObj<T, omitted extends string> = {
	[key in keyof Omit<T, omitted>]: {
		valid: dataset<Omit<T, omitted>>;
		invalid: dataset<Omit<T, omitted>>;
	};
};

export const orgData: validityDataObj<Org, "id"> = {
	name: {
		valid: [
			randomAlphanumString(1),
			randomAlphanumString(7) + " " + randomAlphanumString(18),
			randomAlphanumString(7) + "-" + randomAlphanumString(18),
			randomAlphanumString(30),
		],
		invalid: ["", "            ", "Invalid symbol @", randomAlphanumString(31)],
	},
	color: {
		valid: ["123456", "abcdef", "ABCDEF", "1b3D5f"],
		invalid: ["#123456", "12345", "1234567", "5e6f7g"],
	},
};

export const agentData: validityDataObj<Agent, "id" | "orgId" | "internals"> = {
	name: {
		valid: [
			randomAlphanumString(1),
			randomAlphanumString(7) + " " + randomAlphanumString(18),
			randomAlphanumString(7) + "-" + randomAlphanumString(18),
			randomAlphanumString(30),
		],
		invalid: ["", "            ", "Invalid symbol @", randomAlphanumString(31)],
	},
	department: {
		valid: [
			randomAlphanumString(2),
			randomAlphanumString(12) + " " + randomAlphanumString(22),
			randomAlphanumString(12) + "-" + randomAlphanumString(22),
			randomAlphanumString(50),
		],
		invalid: ["X", "              ", "Invalid symbol @", randomAlphanumString(51)],
	},
	countryCode: {
		valid: ["1", "23", "456", "999"],
		invalid: ["012", "+123", "1234", "1b3"],
	},
	timezone: {
		valid: ["Europe/Helsinki", "America/Argentina/Rio_Gallegos", "Asia/Hong_Kong", "Africa/Algiers"],
		invalid: ["Finland/Helsinki", "America/Rio Gallegos", "Asia/HongKong", "africa/algiers"],
	},
};
