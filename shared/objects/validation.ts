import {timezoneValuesRegex} from "./timezones.js";

export const regex = {
	color: /^[0-9A-F]{6}$/i,
	countryCode: /^[1-9][0-9]{0,2}$/,
	phoneNumber: /^[1-9][0-9]{8}$/,
	timezone: timezoneValuesRegex,
} as const satisfies {[key: string]: RegExp};

export const length = {
	orgName: {min: 1, max: 30},
	agentName: {min: 2, max: 30}, // max is not large enough for some names, but i'll make it clear that this is the name that'll appear on invites and should therefore be presentable. but also that approach might be too strict... i'll just have to see if using the unabbreviated versions of long names is that important to their cultures, even in business contexts, to be worth the design consequences
	agentDepartment: {min: 2, max: 50}, // same as above, max length is subject to change
} as const satisfies {[key: string]: {min: number; max: number}};
