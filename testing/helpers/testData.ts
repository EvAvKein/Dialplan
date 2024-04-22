import {type Org, type Agent} from "../../shared/objects/org";
import {type Invite} from "../../shared/objects/inv";
import {randomAlphanumString} from "./../../shared/helpers/randomAlphanumString";

type dataset<T> = [T, T, T, T];

const dataExample: dataset<string> = ["", "", "", ""];
export const datasetLength = dataExample.length;

type validationValues<T> = {
	valid: dataset<T>;
	invalid: dataset<T>;
};

type validityDataObj<T, omitted extends string> = {
	[K in keyof Omit<T, omitted>]: T[K] extends object ? validityDataObj<T[K], omitted> : validationValues<T[K]>;
};

export const orgData: validityDataObj<Org, "id"> = {
	name: {
		valid: [
			randomAlphanumString(1),
			randomAlphanumString(7) + " " + randomAlphanumString(18),
			randomAlphanumString(7) + "- o'" + randomAlphanumString(15),
			randomAlphanumString(30),
		],
		invalid: ["", "            ", "Invalid symbol @", randomAlphanumString(31)],
	},
	color: {
		valid: ["123456", "abcdef", "ABCDEF", "1b3D5f"],
		invalid: ["#123456", "12345", "1234567", "5e6f7g"],
	},
	customInvCss: {
		valid: [
			"",
			"* {color: red}",
			`
		.agentSection {
		 background-color: #123456;
		}

		.orgSection {
		 background-color: #abcdef;
		}
	 
	 `,
			`
			.inviteId {
				--color: #aaa; /* surprisingly necessary despite clamp */
				color: var(--color);
			}
		`,
		],
		invalid: [
			"@import url('https://example.com/malice.css');",
			"background-image: url('javascript:alert(\"XSS\")');",
			"background-image: url('data:text/javascript;base64,YWxlcnQoIlhTUyIpOw==');",
			"behavior: url('https://example.com/malicious-behavior.htc');",
		],
	},
	customInvCssOverrides: {
		valid: [true, false, true, false],
		invalid: [1, 0, "true", "false"] as unknown as dataset<boolean>,
	},
};

export const agentData: validityDataObj<Agent, "id" | "orgId" | "internals"> = {
	name: {
		valid: [
			randomAlphanumString(1),
			randomAlphanumString(7) + " " + randomAlphanumString(18),
			randomAlphanumString(7) + "- o'" + randomAlphanumString(15),
			randomAlphanumString(30),
		],
		invalid: ["", "            ", "Invalid symbol @", randomAlphanumString(31)],
	},
	department: {
		valid: [
			randomAlphanumString(2),
			randomAlphanumString(12) + " " + randomAlphanumString(22),
			randomAlphanumString(12) + "- o'" + randomAlphanumString(19),
			randomAlphanumString(50),
		],
		invalid: ["X", "              ", "Invalid symbol @", randomAlphanumString(51)],
	},
	countryCode: {
		valid: ["1", "23", "456", "999"],
		invalid: ["012", "1234", "+123", "1b3"],
	},
	timezone: {
		valid: ["Europe/Helsinki", "America/Argentina/Rio_Gallegos", "Asia/Hong_Kong", "Africa/Algiers"],
		invalid: ["Finland/Helsinki", "America/Rio Gallegos", "Asia/HongKong", "africa/algiers"],
	},
};

export const inviteData: validityDataObj<Invite, "id" | "orgId" | "agentId"> = {
	recipient: {
		name: {
			valid: [
				randomAlphanumString(1),
				randomAlphanumString(7) + " " + randomAlphanumString(18),
				randomAlphanumString(7) + "- o'" + randomAlphanumString(15),
				randomAlphanumString(30),
			],
			invalid: ["", "            ", "Invalid symbol @", randomAlphanumString(31)],
		},
		phone: {
			number: {
				valid: ["123456789", "987654321", "985669420", "010101010"],
				invalid: ["12345678", "1234567890", "12356789.1", "1b3456789"],
			},
			countryCode: {
				valid: ["1", "23", "456", "999"],
				invalid: ["012", "1234", "+123", "1b3"],
			},
		},
	},
	secCallDuration: {
		valid: [1, 23, 456, 999],
		invalid: [1234, -123, 12.3, 123.4],
	},
	expiry: {
		// avoiding non-zero seconds because 1. no plans to ever support that granularity (frontend input nor backend) 2. replacing ":00Z" with nothing  (for datetime-local inputs) is more readable than removing a particular number of final characters
		valid: ["2025-01-01T01:00:00Z", "2026-04-18T10:01:00Z", "2027-12-31T20:00:00Z", "2077-09-05T23:59:00Z"],
		invalid: ["2025-02-30T23:59", "2025-1-1T9:31:00Z", "2025/01/01T21:16:00Z", "01-01-2025T20:01:00Z"],
	},
	notes: {
		forRecipient: {
			valid: ["", "!@#$%^&*()_+[]{}\\|:'.?<>,.1234567890", ' "שפה אחרת" ', randomAlphanumString(250)],
			invalid: [" ", randomAlphanumString(251), randomAlphanumString(251), randomAlphanumString(251)],
		},
		forOrg: {
			valid: ["", "!@#$%^&*()_+[]{}\\|:'.?<>,.1234567890", ' "שפה אחרת" ', randomAlphanumString(500)],
			invalid: [" ", randomAlphanumString(501), randomAlphanumString(501), randomAlphanumString(501)],
		},
	},
};
